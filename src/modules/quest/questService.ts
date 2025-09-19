// src/modules/quest/questService.ts

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function requestQuest(questId: number, userId: number) {
  const quest = await prisma.quest.findUnique({ where: { id: questId } });
  if (!quest || quest.isTaken) {
    return { success: false, message: "이미 다른 사람이 수주했습니다." };
  }

  await prisma.quest.update({
    where: { id: questId },
    data: {
      isTaken: true,
      takerId: userId,
      takenAt: new Date(),
    },
  });

  return { success: true, message: "퀘스트를 수주했습니다." };
}
