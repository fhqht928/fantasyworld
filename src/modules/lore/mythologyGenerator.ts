// src/modules/lore/mythologyGenerator.ts

import { PrismaClient } from "@prisma/client";
import { callGeminiAPI } from "../../services/geminiService";

const prisma = new PrismaClient();

export async function generateMythologyForRegion(regionName: string) {
  const prompt = `
너는 게임 세계에 존재하는 고대 신화/전설/종교를 생성하는 AI야.

[지역 정보]
- 지역 이름: ${regionName}

[요청]
- 이 지역에 전해지는 고대 신화 하나를 생성해줘.
- 신의 이름, 전설 요약, 중심 교리, 신자 수, 종교의 영향력 등을 포함.
- JSON 형태로 생성
`;

  const result = await callGeminiAPI(prompt);
  const data = JSON.parse(result);

  return await prisma.religion.create({
    data: {
      name: data.name,
      originRegion: regionName,
      description: data.summary,
      doctrine: data.doctrine,
      influenceLevel: data.influence,
      estimatedFollowers: data.followers,
    },
  });
}
