// src/modules/story/scenarioMaster.ts

import { PrismaClient } from "@prisma/client";
import { callGeminiAPI } from "../../services/geminiService";

const prisma = new PrismaClient();

export interface ScenarioPhase {
  name: string;
  description: string;
  trigger: string;
  successOutcome: string;
  failureOutcome: string;
}

export interface ScenarioPlanCore {
  title: string;
  synopsis: string;
  tensionLevel: "낮음" | "중간" | "높음" | "재앙";
  phases: ScenarioPhase[];
  globalConsequences: string[];
  recommendedQuestHooks: string[];
}

export interface ScenarioPlan extends ScenarioPlanCore {
  snapshotId: number;
  generatedAt: string;
}

function extractJson(text: string): string {
  const trimmed = text.trim();
  if (trimmed.startsWith("{")) {
    return trimmed;
  }

  const start = trimmed.indexOf("{");
  const end = trimmed.lastIndexOf("}");
  if (start !== -1 && end !== -1) {
    return trimmed.slice(start, end + 1);
  }

  throw new Error("Gemini 응답에서 JSON을 찾지 못했습니다.");
}

function normaliseScenario(data: ScenarioPlanCore): ScenarioPlanCore {
  return {
    title: data.title || "이름 없는 위기",
    synopsis: data.synopsis || "세계에 긴장이 감돌고 있습니다.",
    tensionLevel: data.tensionLevel ?? "중간",
    phases: Array.isArray(data.phases)
      ? data.phases.map((phase) => ({
          name: phase.name || "전개",
          description: phase.description || "상세 정보 없음",
          trigger: phase.trigger || "플레이어의 선택",
          successOutcome: phase.successOutcome || "세계가 안정을 되찾습니다.",
          failureOutcome: phase.failureOutcome || "커다란 위기가 발생합니다.",
        }))
      : [],
    globalConsequences: Array.isArray(data.globalConsequences) ? data.globalConsequences : [],
    recommendedQuestHooks: Array.isArray(data.recommendedQuestHooks)
      ? data.recommendedQuestHooks
      : [],
  };
}

export async function craftScenarioPlan(userId: number): Promise<ScenarioPlan> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      quests: {
        where: { completedAt: null },
        select: { title: true },
      },
      titles: true,
      languages: { include: { language: true } },
    },
  });

  if (!user) {
    throw new Error("플레이어를 찾을 수 없습니다.");
  }

  const activeEvents = await prisma.globalEvent.findMany({
    where: { isActive: true },
    select: { title: true, type: true, affectedRegion: true },
  });

  const nobleFactions = await prisma.nPC.findMany({
    where: { isNoble: true, isAlive: true },
    take: 5,
    select: {
      name: true,
      nobleTitle: true,
      mood: true,
      city: { select: { name: true } },
    },
  });

  const prompt = `
당신은 웹 기반 온라인 RPG의 AI 시나리오 마스터입니다.
플레이어의 행동과 현재 세계 상태를 고려하여 새로운 메인 스토리를 제안하세요.

[플레이어]
- 이름: ${user.username}
- 명성: ${user.reputation}, 악명: ${user.notoriety}
- 보유 칭호: ${user.titles.map((t) => `${t.type}(${t.region})`).join(", ") || "없음"}
- 사용 가능한 언어: ${user.languages
    .map((lang) => `${lang.language.name}(${lang.fluency}%)`)
    .join(", ") || "공용어"}
- 진행 중인 퀘스트: ${user.quests.map((q) => q.title).join(", ") || "없음"}

[세계 상황]
- 활성 글로벌 이벤트: ${
    activeEvents.length
      ? activeEvents.map((event) => `${event.title}(${event.type}) - ${event.affectedRegion}`).join(" | ")
      : "없음"
  }
- 영향력 있는 NPC 세력: ${
    nobleFactions.length
      ? nobleFactions
          .map((f) => `${f.nobleTitle ?? "귀족"} ${f.name} - ${f.city?.name ?? "미상"} (${f.mood})`)
          .join(" | ")
      : "정보 없음"
  }

JSON으로만 응답하세요. 형식은 아래와 같습니다.
{
  "title": "시나리오 제목",
  "synopsis": "전체 개요",
  "tensionLevel": "낮음|중간|높음|재앙 중 하나",
  "phases": [
    {
      "name": "페이즈 이름",
      "description": "세부 내용",
      "trigger": "시작 조건",
      "successOutcome": "성공 시 결과",
      "failureOutcome": "실패 시 결과"
    }
  ],
  "globalConsequences": ["세계 변화"],
  "recommendedQuestHooks": ["추가 퀘스트"]
}
`;

  const response = await callGeminiAPI(prompt);
  const rawJson = extractJson(response);
  const parsed = JSON.parse(rawJson) as ScenarioPlanCore;
  const core = normaliseScenario(parsed);

  const snapshot = await prisma.worldSnapshot.create({
    data: {
      label: `scenario:${user.username}:${new Date().toISOString()}`,
      jsonData: {
        type: "scenario-plan",
        userId,
        scenario: core,
      },
    },
  });

  return {
    ...core,
    snapshotId: snapshot.id,
    generatedAt: snapshot.createdAt.toISOString(),
  };
}
