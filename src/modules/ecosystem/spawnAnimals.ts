// src/modules/ecosystem/spawnAnimals.ts

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function spawnDefaultAnimals(areaId: number) {
  await prisma.animalPopulation.createMany({
    data: [
      { species: "토끼", type: "herbivore", population: 50, areaId },
      { species: "사슴", type: "herbivore", population: 30, areaId },
      { species: "늑대", type: "predator", population: 10, areaId },
      { species: "곰", type: "predator", population: 5, areaId },
    ],
  });
}
