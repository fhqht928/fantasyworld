// scripts/saveWorldToDB.ts
import { PrismaClient } from '@prisma/client';
import * as fs from 'fs/promises';
import * as path from 'path';

const prisma = new PrismaClient();

async function saveWorldToDB() {
  const filePath = path.join(__dirname, 'generatedWorld.json');
  const file = await fs.readFile(filePath, 'utf-8');
  const data = JSON.parse(file);

  // 언어 생성
  const languageMap: Record<string, number> = {};
  for (const name of data.languages) {
    const lang = await prisma.language.upsert({
      where: { name },
      update: {},
      create: {
        name,
        isAncient: false,
        region: '알 수 없음',
      },
    });
    languageMap[name] = lang.id;
  }

  // 국가 및 도시 생성
  for (const countryData of data.countries) {
    const country = await prisma.country.create({
      data: {
        name: countryData.name,
        description: countryData.description,
        language: countryData.language,
      },
    });

    for (const cityData of countryData.cities) {
      await prisma.city.create({
        data: {
          name: cityData.name,
          description: cityData.description,
          population: cityData.population,
          countryId: country.id,
        },
      });
    }
  }

  console.log('✅ 세계 데이터 DB 저장 완료');
}

saveWorldToDB()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error('❌ 오류 발생:', e);
    prisma.$disconnect();
    process.exit(1);
  });
