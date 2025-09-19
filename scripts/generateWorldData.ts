// scripts/generateWorldData.ts
import { GoogleGenerativeAI } from '@google/generative-ai';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as dotenv from 'dotenv';
dotenv.config();
console.log('🔑 Gemini API KEY:', process.env.GEMINI_API_KEY);

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

async function generateWorldData() {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const prompt = `
판타지 세계를 생성해줘. 다음 형식의 JSON으로:

{
  "languages": [...],
  "countries": [
    {
      "name": "",
      "description": "",
      "language": "",
      "cities": [
        {
          "name": "",
          "description": "",
          "population": 12345
        }
      ]
    }
  ]
}
각 국가는 1~2개 도시를 가지며, 전체 2~3개 국가가 포함되도록 해줘.
  `;

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  const jsonStart = text.indexOf('{');
  const jsonEnd = text.lastIndexOf('}');
  const jsonString = text.slice(jsonStart, jsonEnd + 1);

  const worldData = JSON.parse(jsonString);

  const outPath = path.join(__dirname, 'generatedWorld.json');
  await fs.writeFile(outPath, JSON.stringify(worldData, null, 2), 'utf-8');

  console.log('✅ 세계 데이터 생성 완료: generatedWorld.json');
}

generateWorldData().catch(console.error);
