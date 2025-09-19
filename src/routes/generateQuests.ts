// src/routes/generateQuest.ts
import express from 'express';
import { PrismaClient } from '@prisma/client';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();
const prisma = new PrismaClient();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

router.post('/generate-quest', async (req, res) => {
  const { playerMessage, npcId } = req.body;

  if (!playerMessage || !npcId) {
    return res.status(400).json({ error: 'playerMessage와 npcId는 필수입니다.' });
  }

  try {
    const npc = await prisma.nPC.findUnique({ where: { id: npcId } });
    if (!npc) return res.status(404).json({ error: '해당 NPC를 찾을 수 없습니다.' });

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
    const prompt = `
당신은 NPC "${npc.name}"입니다. 다음 플레이어의 요청에 기반해 퀘스트를 만들어주세요:
"${playerMessage}"

퀘스트를 아래 JSON 형태로 응답하세요:
{
  "title": "퀘스트 제목",
  "description": "퀘스트 설명",
  "type": "전투 | 수집 | 탐험 | 제작 등 중 택1",
  "reward": "보상 내용",
  "reputationRequired": 숫자 (기본값 0)
}`;

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();
    const jsonText = text.replace(/```json|```/g, '');
    const quest = JSON.parse(jsonText);

    const newQuest = await prisma.quest.create({
      data: {
        title: quest.title,
        description: quest.description,
        type: quest.type,
        reward: quest.reward,
        reputationRequired: quest.reputationRequired ?? 0,
        giverId: npcId,
      },
    });

    res.json(newQuest);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '퀘스트 생성 중 오류 발생' });
  }
});

export default router;
