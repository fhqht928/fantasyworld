// src/modules/reputation/reputationService.ts

import { PrismaClient } from "@prisma/client";
import { generateBountyQuest } from "../quest/generateBountyQuest";

const prisma = new PrismaClient();

export async function updateReputation(userId: number, change: number) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return;

  const newReputation = user.reputation + change;
  const newNotoriety = user.notoriety + (change < 0 ? Math.abs(change) : 0);

  await prisma.user.update({
    where: { id: userId },
    data: {
      reputation: newReputation,
      notoriety: newNotoriety,
    },
  });

  if (newNotoriety >= 30) {
    await generateBountyQuest(userId);
  }
}
