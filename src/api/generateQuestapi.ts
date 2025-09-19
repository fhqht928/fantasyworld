import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

dotenv.config();

const router = express.Router();
const prisma = new PrismaClient();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

router.post('/generate-quest', async (req, res) => {
  const { playerMessage, npcId } = req.body;

  if (!playerMessage || !npcId) {
    return res.status(400).json({ error: 'playerMessage and npcId are required' });
  }

  try {
    const npc = await prisma.nPC.findUnique({ where: { id: npcId } });
    if (!npc) {
      return res.status(404).json({ error: 'NPC not found' });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro-latest' });

    const prompt = `NPC 이름: ${npc.name}\n직업: ${npc.job}\n성격: ${npc.personality}\n
플레이어가 이렇게 말했습니다: "${playerMessage}"

이 대화 문맥에 맞는 퀘스트 하나를 JSON 형식으로 만들어줘. 다음 형식을 따라줘:
{
  "title": "string",
  "description": "string",
  "type": "string",
  "reward": "string",
  "reputationRequired": number
}`;

    const result = await model.generateContent(prompt);
    const text = result.response.text().replace(/```json|```/g, '').trim();

    const quest = JSON.parse(text);

    const saved = await prisma.quest.create({
      data: {
        title: quest.title,
        description: quest.description,
        type: quest.type,
        reward: quest.reward,
        reputationRequired: quest.reputationRequired,
        giverId: npcId,
        isRepeatable: false
      }
    });

    res.json(saved);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to generate quest' });
  }
});

export default router;
