// src/modules/npc/npcStoryGenerator.ts

import { PrismaClient } from "@prisma/client";
import { callGeminiAPI } from "../services/geminiService";

const prisma = new PrismaClient();

export async function generateNPCStory(npcId: number) {
  const npc = await prisma.nPC.findUnique({ where: { id: npcId } });
  if (!npc) return;

  const prompt = `
당신은 캐릭터의 인생 이야기를 창작하는 AI입니다.

[캐릭터 정보]
- 이름: ${npc.name}
- 나이: ${new Date().getFullYear() - npc.birthYear}
- 감정 상태: ${npc.mood}
- 명성: ${npc.fame}, 악명: ${npc.notoriety}
- 직업: 무직 (기본값)

[요청]
- 이 인물이 살아온 이야기를 간단한 제목과 요약으로 만들어 주세요.
- 현실적인 경험, 감정, 갈등이 반영되도록 하세요.
- JSON: { "title": "...", "summary": "..." }
`;

  const res = await callGeminiAPI(prompt);
  const data = JSON.parse(res);

  return await prisma.nPCStory.create({
    data: {
      npcId,
      title: data.title,
      summary: data.summary,
    },
  });
}
