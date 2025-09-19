// src/modules/event/globalEventGenerator.ts

import { PrismaClient } from "@prisma/client";
import { callGeminiAPI } from "../../services/geminiService";

const prisma = new PrismaClient();

export async function generateGlobalEvent() {
  const prompt = `
당신은 판타지 세계에서 발생할 수 있는 대형 사건을 생성하는 AI입니다.

[요청]
- 전염병, 전쟁, 자연재해, 기근, 폭동, 유물 발견 등의 랜덤 이벤트 중 하나를 골라 생성해주세요.
- 영향 받는 지역, 영향 범위, 지속 시간, 주요 피해 대상, 세계에 미치는 영향을 포함해주세요.
- JSON 형태로 반환
`;

  const result = await callGeminiAPI(prompt);
  const data = JSON.parse(result);

  return await prisma.globalEvent.create({
    data: {
      title: data.title,
      type: data.type,
      affectedRegion: data.region,
      description: data.description,
      durationDays: data.duration,
      impact: data.impact,
      isActive: true,
      startedAt: new Date(),
    },
  });
}
