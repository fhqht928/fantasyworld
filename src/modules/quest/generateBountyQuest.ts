// src/modules/quest/generateBountyQuest.ts

import { PrismaClient } from "@prisma/client";
import { callGeminiAPI } from "../services/geminiService";

const prisma = new PrismaClient();

export async function generateBountyQuest(targetUserId: number) {
  const user = await prisma.user.findUnique({ where: { id: targetUserId } });
  if (!user) return;

  const prompt = `
너는 악명 높은 유저를 토벌하거나 암살하는 긴급 퀘스트를 설계하는 AI야.

[타겟 정보]
- 이름: ${user.username}
- 악명: ${user.notoriety}
- 활동 도시 ID: ${user.lastKnownCityId}

이 유저를 제거하거나 생포하는 퀘스트를 설계해줘.
형식은 '제목 / 설명 / 보상 / 난이도 / 조건' 으로 간결하게.
`;

  const content = await callGeminiAPI(prompt);
  const [title, description, reward, difficulty, condition] = content.split("/").map(s => s.trim());

  await prisma.quest.create({
    data: {
      title,
      description,
      issuerId: null,
      isTaken: false,
      reputationRequired: 10,
      notorietyTrigger: true,
      bountyTargetId: targetUserId,
      metadata: {
        reward,
        difficulty,
        condition,
      },
    },
  });
}
