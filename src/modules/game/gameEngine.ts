// src/modules/game/gameEngine.ts

import { PrismaClient } from "@prisma/client";
import { generateWorld } from "../world/worldGenerator";
import { spawnDefaultAnimals } from "../ecosystem/spawnAnimals";
import { simulateEcosystem } from "../ecosystem/ecosystemEngine";
import { processCorpseDecay } from "../ecosystem/corpseDecayEngine";
import { updateWorldTime } from "../world/worldClock";
import { generateMythologyForRegion } from "../lore/mythologyGenerator";
import { generateArtifact } from "../lore/artifactGenerator";
import { updateEconomy } from "../economy/economyEngine";
import { generateGlobalEvent } from "../event/globalEventGenerator";
import { expirePastEvents } from "../event/checkEventExpiry";
import { checkPromotion } from "../politics/promotionChecker";
import { issueTaxPolicy } from "../politics/politicalActionService";
import { createWorldSnapshot } from "../world/worldSnapshotSaver";
import { craftScenarioPlan } from "../story/scenarioMaster";
import type { ScenarioPlan } from "../story/scenarioMaster";

export type { ScenarioPlan } from "../story/scenarioMaster";

export interface GameEngineOptions {
  /** 실제 시간 기준 틱 호출 간격(분) */
  realMinutesPerTick?: number;
  /** 각 틱마다 전 세계 이벤트가 발생할 확률 */
  globalEventChance?: number;
}

/**
 * 게임 서버의 모든 서브 시스템을 조율하는 오케스트레이션 엔진.
 * 요구사항에 명시된 지속적인 세계 시뮬레이션을 중앙 집중식으로 관리한다.
 */
export class GameEngine {
  private prisma: PrismaClient;
  private tickTimer?: NodeJS.Timeout;
  private bootstrapped = false;

  constructor(private readonly options: GameEngineOptions = {}) {
    this.prisma = new PrismaClient();
  }

  /** 초기 월드, 종교, 생태계, 언어 등을 생성한다. */
  async bootstrap(seed?: string) {
    await this.ensureLanguages();
    await this.ensureWorld(seed);
    await this.ensureReligions();
    await this.ensureEcosystems();
    await this.ensureWorldClock();
    this.bootstrapped = true;
  }

  /**
   * 실시간 시뮬레이션 루프를 시작한다. 기본값은 5분마다 상태를 동기화한다.
   */
  start() {
    if (!this.bootstrapped) {
      throw new Error("GameEngine.bootstrap()을 먼저 호출해야 합니다.");
    }

    if (this.tickTimer) return;

    const minutesPerTick = this.options.realMinutesPerTick ?? 5;
    const intervalMs = minutesPerTick * 60 * 1000;

    const run = async () => {
      try {
        await this.runMaintenanceCycle();
      } catch (error) {
        console.error("⚠️ 게임 엔진 주기 실행 오류", error);
      }
    };

    this.tickTimer = setInterval(run, intervalMs);
    // 서버 시작 직후 한 번 즉시 실행해서 첫 상태를 동기화한다.
    void run();
  }

  /**
   * 현재 세계 상태를 스냅샷으로 저장한다. UI에서 백업/로드용으로 활용 가능하다.
   */
  async snapshot(label = `auto-${new Date().toISOString()}`) {
    await createWorldSnapshot(label);
  }

  /**
   * 플레이어별 맞춤 메인 시나리오를 생성하고 저장한다.
   */
  async generateScenarioForPlayer(userId: number): Promise<ScenarioPlan> {
    return await craftScenarioPlan(userId);
  }

  /**
   * 엔진을 종료한다. 주기 실행을 멈추고 데이터베이스 연결을 정리한다.
   */
  async shutdown() {
    if (this.tickTimer) {
      clearInterval(this.tickTimer);
      this.tickTimer = undefined;
    }
    await this.prisma.$disconnect();
  }

  private async ensureWorld(seed?: string) {
    const countryCount = await this.prisma.country.count();
    if (countryCount > 0) return;

    await generateWorld(seed);
    await updateEconomy();
  }

  private async ensureReligions() {
    const countries = await this.prisma.country.findMany({ include: { cities: true } });

    for (const country of countries) {
      const existingReligion = await this.prisma.religion.findFirst({
        where: { originRegion: country.name },
      });

      if (!existingReligion) {
        const religion = await generateMythologyForRegion(country.name);
        if (religion) {
          await generateArtifact(religion.id);
        }
      }
    }
  }

  private async ensureEcosystems() {
    const wildAreas = await this.prisma.wildArea.findMany({ include: { populations: true } });

    for (const area of wildAreas) {
      if (area.populations.length === 0) {
        await spawnDefaultAnimals(area.id);
      }
    }
  }

  private async ensureWorldClock() {
    const exists = await this.prisma.worldTime.findFirst();
    if (!exists) {
      await this.prisma.worldTime.create({ data: { lastSimulated: new Date() } });
    }
  }

  private async ensureLanguages() {
    const count = await this.prisma.language.count();
    if (count > 0) return;

    await this.prisma.language.createMany({
      data: [
        { name: "공용어", isAncient: false, region: "대륙 전역" },
        { name: "엘리시안", isAncient: false, region: "엘프 숲" },
        { name: "카르둔", isAncient: false, region: "산맥 왕국" },
        { name: "하록", isAncient: false, region: "사막 부족" },
        { name: "고대 룬어", isAncient: true, region: "유적" },
      ],
    });
  }

  private async runMaintenanceCycle() {
    await updateWorldTime();

    await Promise.all([
      simulateEcosystem(),
      processCorpseDecay(),
      this.refreshPolitics(),
      expirePastEvents(),
    ]);

    // 일정 확률로 랜덤 글로벌 이벤트를 생성한다.
    const chance = this.options.globalEventChance ?? 0.25;
    if (Math.random() < chance) {
      await generateGlobalEvent();
    }

    // 세금 정책은 귀족/시장 이상이 있는 지역만 갱신한다.
    await this.balanceRegionalTaxes();
  }

  private async refreshPolitics() {
    const candidates = await this.prisma.user.findMany({
      where: { reputation: { gte: 80 } },
      select: { id: true },
    });

    await Promise.all(candidates.map((candidate) => checkPromotion(candidate.id)));
  }

  private async balanceRegionalTaxes() {
    const titleHolders = await this.prisma.playerTitle.findMany({
      where: { type: { in: ["시장", "왕"] } },
    });

    await Promise.all(
      titleHolders.map(async (holder) => {
        const randomRate = 5 + Math.floor(Math.random() * 10);
        try {
          await issueTaxPolicy(holder.userId, randomRate);
        } catch (error) {
          // 권한 부족 시에는 무시한다.
        }
      }),
    );
  }
}
