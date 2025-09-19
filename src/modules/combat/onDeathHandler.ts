// src/modules/combat/onDeathHandler.ts

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function handleDeath({ type, targetId, location, isInWater }: {
  type: "유저" | "NPC",
  targetId: number,
  location: string,
  isInWater: boolean,
}) {
  await prisma.corpse.create({
    data: {
      type,
      npcId: type === "NPC" ? targetId : undefined,
      userId: type === "유저" ? targetId : undefined,
      decayStage: "신선",
      location,
      isWaterlogged: isInWater,
      causeOfDeath: "전투",
    },
  });
}
