// src/modules/world/worldSnapshotRestorer.ts

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function restoreWorldSnapshot(snapshotId: number) {
  const snapshot = await prisma.worldSnapshot.findUnique({ where: { id: snapshotId } });
  if (!snapshot) throw new Error("스냅샷을 찾을 수 없습니다.");

  const data = snapshot.jsonData as any;

  await prisma.$transaction([
    prisma.nPC.deleteMany({}),
    prisma.user.deleteMany({}),
    prisma.city.deleteMany({}),
    prisma.quest.deleteMany({}),
    prisma.economy.deleteMany({}),
    prisma.corpse.deleteMany({}),
    prisma.weather.deleteMany({}),
    prisma.animalPopulation.deleteMany({}),

    prisma.nPC.createMany({ data: data.npcs }),
    prisma.user.createMany({ data: data.users }),
    prisma.city.createMany({ data: data.cities }),
    prisma.quest.createMany({ data: data.quests }),
    prisma.economy.createMany({ data: data.economy }),
    prisma.corpse.createMany({ data: data.corpses }),
    prisma.weather.createMany({ data: data.weather }),
    prisma.animalPopulation.createMany({ data: data.animals }),
  ]);

  return { success: true, label: snapshot.label };
}
