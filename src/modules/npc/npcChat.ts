import { simulateTranslation } from "../language/translationHelper";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getTranslatedDialog(npcId: number, userId: number, originalText: string) {
  const npc = await prisma.nPC.findUnique({ where: { id: npcId }, include: { language: true } });
  const userLang = await prisma.userLanguage.findFirst({
    where: { userId, languageId: npc?.languageId },
  });

  const fluency = userLang?.fluency ?? 0;
  return simulateTranslation(originalText, fluency);
}
