// src/modules/lore/artifactGenerator.ts

import { PrismaClient } from "@prisma/client";
import { callGeminiAPI } from "../services/geminiService";

const prisma = new PrismaClient();

export async function generateArtifact(religionId: number) {
  const religion = await prisma.religion.findUnique({ where: { id: religionId } });
  if (!religion) return;

  const prompt = `
너는 종교에 관련된 신비한 유물을 생성하는 AI야.

[종교 정보]
- 이름: ${religion.name}
- 교리: ${religion.doctrine}

[요청]
- 이 종교에서 숭배되는 전설의 유물 하나를 생성해줘.
- 유물 이름, 전설적 설명, 알려진 힘의 단서 포함.
- JSON으로 출력
`;

  const res = await callGeminiAPI(prompt);
  const data = JSON.parse(res);

  return await prisma.artifact.create({
    data: {
      name: data.name,
      lore: data.lore,
      powerHint: data.power,
      religionId,
    },
  });
}
