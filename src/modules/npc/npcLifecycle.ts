// src/modules/npc/npcLifecycle.ts

import { faker } from "@faker-js/faker";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function simulateNPCYear() {
  const npcs = await prisma.nPC.findMany();

  for (const npc of npcs) {
    const age = new Date().getFullYear() - npc.birthYear;

    // 사망 확률 증가
    if (age > 80 && Math.random() < 0.3) {
      await prisma.nPC.update({
        where: { id: npc.id },
        data: { isAlive: false, deathYear: new Date().getFullYear() },
      });
      continue;
    }

    // 감정 변화 (랜덤)
    const moods = ["happy", "angry", "sad", "neutral", "curious"];
    const mood = moods[Math.floor(Math.random() * moods.length)];

    // 명성/악명 변화
    const fameChange = Math.floor(Math.random() * 3) - 1;
    const notorietyChange = Math.floor(Math.random() * 3) - 1;

    await prisma.nPC.update({
      where: { id: npc.id },
      data: {
        mood,
        fame: npc.fame + fameChange,
        notoriety: npc.notoriety + notorietyChange,
      },
    });

    // 결혼/자녀 생성
    if (age >= 18 && !npc.partnerId && Math.random() < 0.05) {
      const partner = await findPartner(npc);
      if (partner) {
        await prisma.nPC.update({
          where: { id: npc.id },
          data: { partnerId: partner.id },
        });
        await prisma.nPC.update({
          where: { id: partner.id },
          data: { partnerId: npc.id },
        });

        if (Math.random() < 0.5) {
          const child = await prisma.nPC.create({
            data: {
              name: `${faker.person.firstName()} ${npc.name.split(" ")[1]}`,
              gender: faker.person.sexType(),
              birthYear: new Date().getFullYear(),
              cityId: npc.cityId,
              parent1Id: npc.id,
              parent2Id: partner.id,
              mood: "neutral",
              fame: 0,
              notoriety: 0,
            },
          });
        }
      }
    }
  }
}

async function findPartner(npc: any) {
  return await prisma.nPC.findFirst({
    where: {
      isAlive: true,
      partnerId: null,
      id: { not: npc.id },
      cityId: npc.cityId,
      birthYear: {
        lte: new Date().getFullYear() - 18,
        gte: new Date().getFullYear() - 40,
      },
    },
  });
}
