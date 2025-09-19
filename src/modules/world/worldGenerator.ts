// src/modules/world/worldGenerator.ts

import { PrismaClient } from "@prisma/client";
import { generateCountry, generateCity, generateWildArea, generateDungeon } from "./worldTemplates";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

export async function generateWorld(seed?: string) {
  const worldSeed = seed || faker.string.uuid();

  // 국가 5개 생성
  for (let i = 0; i < 5; i++) {
    const country = generateCountry(worldSeed);
    const createdCountry = await prisma.country.create({ data: country });

    // 각 국가당 3~7개의 도시 생성
    const cityCount = faker.number.int({ min: 3, max: 7 });
    for (let j = 0; j < cityCount; j++) {
      const city = generateCity(worldSeed, createdCountry.id);
      await prisma.city.create({ data: city });
    }

    // 야생 지역과 던전 자동 생성
    const wild = generateWildArea(worldSeed, createdCountry.id);
    const dungeon = generateDungeon(worldSeed, createdCountry.id);

    await prisma.wildArea.create({ data: wild });
    await prisma.dungeon.create({ data: dungeon });
  }

  return { success: true, seed: worldSeed };
}
