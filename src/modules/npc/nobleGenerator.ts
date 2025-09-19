// src/modules/npc/nobleGenerator.ts

import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

export async function generateNoble(cityId: number) {
  const noble = await prisma.nPC.create({
    data: {
      name: `${faker.person.lastName()} 경`,
      gender: faker.person.sexType(),
      birthYear: new Date().getFullYear() - faker.number.int({ min: 30, max: 70 }),
      cityId,
      isNoble: true,
      nobleTitle: faker.helpers.arrayElement(["남작", "자작", "백작", "후작", "공작", "왕"]),
      personality: faker.helpers.arrayElement(["교만", "이성적", "공정", "냉정", "감성적"]),
      mood: "neutral",
      fame: faker.number.int({ min: 30, max: 80 }),
      notoriety: 0,
    },
  });

  return noble;
}
