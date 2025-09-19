// src/api/npcChatController.ts

import express from "express";
import { PrismaClient } from "@prisma/client";
import { getNPCChatPrompt } from "../services/promptBuilder";
import { callGeminiAPI } from "../services/geminiService";

const prisma = new PrismaClient();
const router = express.Router();

router.post("/npc-chat", async (req, res) => {
  const { userMessage, npcId, userName } = req.body;

  const npc = await prisma.nPC.findUnique({ where: { id: npcId } });
  if (!npc) return res.status(404).json({ error: "NPC not found" });

  const prompt = await getNPCChatPrompt(npc, userMessage, userName);
  const npcReply = await callGeminiAPI(prompt);

  return res.json({ reply: npcReply });
});

export default router;
