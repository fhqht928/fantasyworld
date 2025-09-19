// src/modules/world/worldClock.ts

import { PrismaClient } from "@prisma/client";
import { simulateTimePassed } from "../simulation/simulateTimePassed";

const prisma = new PrismaClient();

export async function updateWorldTime() {
  const now = new Date();
  const currentTime = await prisma.worldTime.findFirst();

  if (!currentTime) {
    await prisma.worldTime.create({
      data: {
        lastSimulated: now,
      },
    });
    return;
  }

  const diffInMinutes = Math.floor((now.getTime() - currentTime.lastSimulated.getTime()) / (1000 * 60));
  if (diffInMinutes >= 1) {
    await prisma.worldTime.update({
      where: { id: currentTime.id },
      data: { lastSimulated: now },
    });

    await simulateTimePassed(diffInMinutes);
  }
}
