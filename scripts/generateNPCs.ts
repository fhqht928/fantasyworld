import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
dotenv.config();

import { GoogleGenerativeAI } from '@google/generative-ai';
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const prisma = new PrismaClient();

async function generateNPCsForCity(cityId: number, cityName: string) {
  const prompt = `다음 조건에 따라 ${cityName} 도시에 어울리는 개성 있는 NPC 3명을 JSON 형식으로 생성해줘:

- name (string): NPC 이름
- age (number): 나이
- gender (string): 성별
- personality (string): 성격
- job (string): 직업
- skills (string[]): 특기 및 기술
- background (string): 배경 스토리

출력은 반드시 JSON 배열 형식만 포함해야 하며, 마크다운 없이 작성해.`;

  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  const result = await model.generateContent(prompt);
  const response = await result.response;
  const jsonString = response.text();
  console.log(`📄 Gemini 응답 원본:`, jsonString);

  try {
    const jsonStart = jsonString.indexOf("[");
    const jsonEnd = jsonString.lastIndexOf("]");
    const jsonBody = jsonString.substring(jsonStart, jsonEnd + 1);

    const cleaned = jsonBody.replace(/,(\s*[}\]])/g, '$1');
    const npcs = JSON.parse(cleaned);

    const currentYear = new Date().getFullYear();

    for (const npc of npcs) {
      await prisma.nPC.create({
        data: {
          name: npc.name,
          gender: npc.gender,
          personality: npc.personality,
          job: npc.job,
          skills: Array.isArray(npc.skills) ? npc.skills.join(", ") : npc.skills,
          background: npc.background,
          birthYear: currentYear - (npc.age || 30),
          mood: "평온함",
          city: {
            connect: { id: cityId },
          },
          language: {
            connect: { id: 5 }, // 예시: 공용어 ID
          },
        },
      });
    }

    console.log(`✅ ${cityName} 도시의 NPC 생성 완료`);
  } catch (error) {
    console.error(`❌ JSON 파싱 오류:`, error);
  }
}

async function run() {
  await generateNPCsForCity(1, '실버리프');
  await generateNPCsForCity(2, '깊은돌');
  await generateNPCsForCity(3, '검은강철');
  await prisma.$disconnect();
}

run();
