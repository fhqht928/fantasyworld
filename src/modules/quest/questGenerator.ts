// src/modules/quest/questGenerator.ts

import { PrismaClient } from "@prisma/client";
import { callGeminiAPI } from "../services/geminiService";

const prisma = new PrismaClient();

export async function generateQuest(npcId: number) {
  const npc = await prisma.nPC.findUnique({ where: { id: npcId } });
  if (!npc) return null;

  const prompt = `
당신은 판타지 세계의 퀘스트 디자이너입니다.

[의뢰자 정보]
- 이름: ${npc.name}
- 성별: ${npc.gender}
- 현재 감정 상태: ${npc.mood}
- 명성: ${npc.fame}, 악명: ${npc.notoriety}
- 의뢰자의 위치: 도시 ID ${npc.cityId}

[요청 사항]
- 현실감 있는 퀘스트를 하나 생성하세요.
- 퀘스트 제목, 설명, 보상, 난이도, 성공조건, 실패조건을 포함하세요.
- 다른 사람이 이미 수주하면 퀘스트는 숨겨집니다.
`;

  const content = await callGeminiAPI(prompt);
  const [titleLine, ...bodyLines] = content.split("\n").filter(Boolean);
  const title = titleLine.replace(/^퀘스트 제목:\s*/, "");
  const body = bodyLines.join("\n");

  const quest = await prisma.quest.create({
    data: {
      title,
      description: body,
      issuerId: npcId,
      isTaken: false,
      reputationRequired: 0,
      notorietyTrigger: npc.notoriety > 10,
    },
  });

  return quest;
}
