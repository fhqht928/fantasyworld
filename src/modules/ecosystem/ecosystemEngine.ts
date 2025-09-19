// src/modules/ecosystem/ecosystemEngine.ts

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function simulateEcosystem() {
  const areas = await prisma.wildArea.findMany({
    include: { populations: true },
  });

  for (const area of areas) {
    for (const pop of area.populations) {
      const { species, type, population } = pop;

      let change = 0;

      if (type === "herbivore") {
        change += Math.floor(population * 0.1); // 증식
        change -= Math.floor(population * 0.05); // 자연사
      } else if (type === "predator") {
        const prey = await prisma.animalPopulation.findFirst({
          where: {
            areaId: area.id,
            type: "herbivore",
          },
        });

        if (prey) {
          const huntable = Math.min(prey.population, Math.floor(population * 0.3));
          change += Math.floor(huntable * 0.4); // 사냥 성공 시 생존
          change -= Math.floor(population * 0.2); // 굶주림으로 죽음

          // 피식자 감소
          await prisma.animalPopulation.update({
            where: { id: prey.id },
            data: { population: prey.population - huntable },
          });
        } else {
          change -= Math.floor(population * 0.3); // 먹이 없으면 굶어 죽음
        }
      }

      const newPop = Math.max(0, population + change);

      await prisma.animalPopulation.update({
        where: { id: pop.id },
        data: { population: newPop },
      });
    }
  }
}
