// src/modules/politics/politicalActionService.ts

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function issueTaxPolicy(userId: number, newRate: number) {
  const title = await prisma.playerTitle.findFirst({
    where: { userId, type: { in: ["왕", "시장"] } },
  });

  if (!title || title.authority < 50) {
    throw new Error("정치적 권한이 부족합니다.");
  }

  await prisma.taxPolicy.upsert({
    where: { region: title.region },
    update: { rate: newRate, updatedAt: new Date() },
    create: { region: title.region, rate: newRate },
  });

  return `세율이 ${title.region}에서 ${newRate}%로 설정되었습니다.`;
}
