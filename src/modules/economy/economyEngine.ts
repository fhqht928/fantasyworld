// src/modules/economy/economyEngine.ts

import { PrismaClient } from "@prisma/client";
import { callGeminiAPI } from "../services/geminiService";

const prisma = new PrismaClient();

export async function updateEconomy() {
  const cities = await prisma.city.findMany({
    include: { country: true },
  });

  for (const city of cities) {
    const prompt = `
당신은 게임 내 경제 시뮬레이터입니다.

[도시 정보]
- 도시 이름: ${city.name}
- 국가: ${city.country.name}
- 인구: ${city.population}
- 최근 날씨: 맑음/비/더움/추움 등 가정
- 현재 계절: 가을

[요청]
- 현재 도시의 물가를 5개 품목 기준으로 조정해주세요.
- 예시: 밀, 고기, 철광석, 나무, 물약
- 각 품목별 현재 가격, 수요 증가/감소 요인, 사재기, 생산량 등을 고려
- JSON으로 반환
`;

    const jsonResponse = await callGeminiAPI(prompt);
    const economicData = JSON.parse(jsonResponse);

    for (const item of economicData.items) {
      await prisma.economy.upsert({
        where: {
          cityId_item: {
            cityId: city.id,
            item: item.name,
          },
        },
        update: {
          price: item.price,
          demand: item.demand,
          supply: item.supply,
        },
        create: {
          cityId: city.id,
          item: item.name,
          price: item.price,
          demand: item.demand,
          supply: item.supply,
        },
      });
    }
  }
}
