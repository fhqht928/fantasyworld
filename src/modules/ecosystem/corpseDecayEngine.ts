// src/modules/ecosystem/corpseDecayEngine.ts

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function processCorpseDecay() {
  const corpses = await prisma.corpse.findMany({
    where: { decayStage: { not: "소멸" } },
  });

  const now = new Date();

  for (const corpse of corpses) {
    const hoursPassed = (now.getTime() - new Date(corpse.createdAt).getTime()) / (1000 * 60 * 60);

    let newStage = corpse.decayStage;

    if (hoursPassed >= 1 && hoursPassed < 12) newStage = "부패";
    else if (hoursPassed >= 12 && hoursPassed < 48) newStage = "백골";
    else if (hoursPassed >= 48) newStage = "소멸";

    if (corpse.isWaterlogged && corpse.decayStage === "신선") {
      newStage = "부패";
    }

    await prisma.corpse.update({
      where: { id: corpse.id },
      data: { decayStage: newStage },
    });
  }
}
