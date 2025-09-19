// scripts/seedLanguages.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const exists = await prisma.language.findFirst({ where: { name: '공용어' } });

  if (!exists) {
    await prisma.language.create({
      data: {
        name: '공용어',
        isAncient: false,
      },
    });

    console.log('✅ 공용어 생성 완료');
  } else {
    console.log('ℹ️ 공용어는 이미 존재합니다');
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
