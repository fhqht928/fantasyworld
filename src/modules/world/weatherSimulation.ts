// src/modules/world/weatherSimulation.ts

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const possibleWeather = ["맑음", "비", "눈", "안개", "바람", "폭풍"];

export async function simulateWeather() {
  const areas = await prisma.city.findMany();

  for (const area of areas) {
    const weather = pickWeatherForSeason(area.id);

    await prisma.weather.upsert({
      where: { cityId: area.id },
      update: { condition: weather, updatedAt: new Date() },
      create: { cityId: area.id, condition: weather },
    });
  }
}

function pickWeatherForSeason(regionId: number): string {
  const rand = Math.random();
  if (rand < 0.6) return "맑음";
  if (rand < 0.75) return "비";
  if (rand < 0.85) return "안개";
  if (rand < 0.95) return "바람";
  return "폭풍";
}
