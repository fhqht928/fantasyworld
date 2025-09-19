// src/modules/politics/promotionChecker.ts

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function checkPromotion(userId: number) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return;

  if (user.reputation >= 80) {
    const hasTitle = await prisma.playerTitle.findFirst({ where: { userId } });
    if (!hasTitle) {
      await prisma.playerTitle.create({
        data: {
          userId,
          type: "귀족",
          region: "중앙 왕국",
          grantedAt: new Date(),
          authority: 40,
        },
      });
    }
  }
}
