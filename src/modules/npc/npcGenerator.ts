// src/modules/npc/npcGenerator.ts

import { faker } from "@faker-js/faker";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function generateNPC(cityId: number) {
  const gender = faker.person.sexType();
  const firstName = faker.person.firstName(gender);
  const lastName = faker.person.lastName();

  const npc = await prisma.nPC.create({
    data: {
      name: `${firstName} ${lastName}`,
      gender,
      birthYear: new Date().getFullYear(),
      cityId,
      mood: "neutral",
      fame: 0,
      notoriety: 0,
    },
  });

  return npc;
}
