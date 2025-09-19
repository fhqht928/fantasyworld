// src/modules/quest/archaeologyQuestGenerator.ts

import { callGeminiAPI } from "../../services/geminiService";

export async function generateArchaeologyQuest(userName: string) {
  const prompt = `
너는 고대 문명, 언어, 유물 등을 조사하는 퀘스트를 생성하는 AI야.

[요청]
- 고대 유물 조사 또는 해독 중심의 퀘스트를 하나 생성해줘.
- 퀘스트 제목, 설명, 위치, 고대 언어 이름 포함해서 작성
`;

  const response = await callGeminiAPI(prompt);
  return response;
}
