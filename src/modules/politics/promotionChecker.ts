// src/modules/politics/promotionChecker.ts

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * 플레이어의 명성과 악명을 기반으로 정치적 계급을 순차적으로 승급시킨다.
 *
 * 요구사항: 유저가 귀족 → 시장 → 왕으로 성장 가능해야 함.
 * - 승급 조건은 명성과 악명 모두를 고려한다.
 * - 각 직위는 고유한 관할 지역을 가져야 한다.
 */
export async function checkPromotion(userId: number) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { titles: true },
  });

  if (!user) return;

  const hasTitle = (type: string) => user.titles.some((title) => title.type === type);
  const now = new Date();

  // 1) 왕 승급: 시장 직위를 가지고 있고 명성이 매우 높으며 악명이 낮은 경우
  if (!hasTitle("왕") && hasTitle("시장") && user.reputation >= 180 && user.notoriety <= 20) {
    const kingdom = await pickAvailableKingdom();
    if (kingdom) {
      await prisma.playerTitle.create({
        data: {
          userId,
          type: "왕",
          region: kingdom,
          grantedAt: now,
          authority: 90,
        },
      });
      return;
    }
  }

  // 2) 시장 승급: 귀족이며 명성이 높고 악명이 낮은 경우
  if (!hasTitle("시장") && hasTitle("귀족") && user.reputation >= 120 && user.notoriety <= 30) {
    const city = await pickAvailableCity();
    if (city) {
      await prisma.playerTitle.create({
        data: {
          userId,
          type: "시장",
          region: city,
          grantedAt: now,
          authority: 70,
        },
      });
      return;
    }
  }

  // 3) 귀족 승급: 기본 명성 조건을 충족하고 악명이 과도하지 않은 경우
  if (!hasTitle("귀족") && user.reputation >= 60 && user.notoriety <= 40) {
    const nobleRegion = await pickNobleRegion();
    await prisma.playerTitle.create({
      data: {
        userId,
        type: "귀족",
        region: nobleRegion,
        grantedAt: now,
        authority: 45,
      },
    });
  }
}

async function pickAvailableCity(): Promise<string | null> {
  const existingMayors = await prisma.playerTitle.findMany({
    where: { type: "시장" },
    select: { region: true },
  });

  const occupied = new Set(existingMayors.map((title) => title.region));
  const city = await prisma.city.findFirst({
    where: occupied.size
      ? {
          name: {
            notIn: Array.from(occupied),
          },
        }
      : undefined,
    orderBy: { population: "desc" },
  });

  return city?.name ?? null;
}

async function pickAvailableKingdom(): Promise<string | null> {
  const existingKings = await prisma.playerTitle.findMany({
    where: { type: "왕" },
    select: { region: true },
  });

  const occupied = new Set(existingKings.map((title) => title.region));
  const country = await prisma.country.findFirst({
    where: occupied.size
      ? {
          name: {
            notIn: Array.from(occupied),
          },
        }
      : undefined,
    orderBy: { name: "asc" },
  });

  return country?.name ?? null;
}

async function pickNobleRegion(): Promise<string> {
  const countries = await prisma.country.findMany({ select: { name: true } });
  if (countries.length === 0) {
    return "중앙 왕국"; // 월드가 아직 초기화되지 않은 경우 기본값
  }

  const nobleCounts = await prisma.playerTitle.groupBy({
    by: ["region"],
    where: { type: "귀족" },
    _count: { _all: true },
  });

  const countMap = new Map(nobleCounts.map((entry) => [entry.region, entry._count._all]));

  const sorted = [...countries].sort((a, b) => {
    const countA = countMap.get(a.name) ?? 0;
    const countB = countMap.get(b.name) ?? 0;
    if (countA === countB) {
      return a.name.localeCompare(b.name);
    }
    return countA - countB;
  });

  return sorted[0]?.name ?? "중앙 왕국";
}
