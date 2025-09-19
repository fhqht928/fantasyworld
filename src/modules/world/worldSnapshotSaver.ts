// src/modules/world/worldSnapshotSaver.ts

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function createWorldSnapshot(label: string) {
  const [npcs, users, cities, quests, economy, corpses, weather, animals] = await Promise.all([
    prisma.nPC.findMany(),
    prisma.user.findMany(),
    prisma.city.findMany(),
    prisma.quest.findMany(),
    prisma.economy.findMany(),
    prisma.corpse.findMany(),
    prisma.weather.findMany(),
    prisma.animalPopulation.findMany(),
  ]);

  const snapshot = {
    npcs,
    users,
    cities,
    quests,
    economy,
    corpses,
    weather,
    animals,
  };

  await prisma.worldSnapshot.create({
    data: {
      label,
      jsonData: snapshot,
    },
  });

  return { success: true, label };
}
