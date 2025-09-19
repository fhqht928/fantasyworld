// src/modules/profession/craftItem.ts

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function craftItem(userId: number, recipeId: number) {
  const recipe = await prisma.recipe.findUnique({
    where: { id: recipeId },
    include: { materials: true, product: true },
  });

  const prof = await prisma.playerProfession.findFirst({
    where: { userId, type: recipe?.profession },
  });

  if (!prof) throw new Error("해당 제작 직업이 없습니다.");

  const successChance = Math.min(95, prof.skillLevel * 2 - recipe.difficulty);
  const isSuccess = Math.random() * 100 < successChance;

  if (!isSuccess) {
    return { success: false, message: "제작에 실패했습니다." };
  }

  const quality = Math.min(5, Math.ceil((prof.skillLevel + Math.random() * 10) / 20));

  const item = await prisma.item.create({
    data: {
      name: recipe!.product.name,
      quality,
    },
  });

  // 경험치 증가
  await prisma.playerProfession.update({
    where: { id: prof.id },
    data: {
      experience: { increment: 10 },
      skillLevel: prof.experience + 10 >= prof.skillLevel * 100 ? prof.skillLevel + 1 : prof.skillLevel,
    },
  });

  return { success: true, item };
}
