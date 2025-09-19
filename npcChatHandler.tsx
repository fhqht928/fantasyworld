// npcChatHandler.ts

import { PrismaClient } from "@prisma/client";
import { getNobleDialog } from "./src/modules/dialog/nobleDialog";

const prisma = new PrismaClient();

export async function handleNobleInteraction(nobleId: number, userId: number) {
  const noble = await prisma.nPC.findUnique({ where: { id: nobleId } });
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!noble?.isNoble) return "이 NPC는 귀족이 아닙니다.";
  if (!user) return "유저 정보를 불러올 수 없습니다.";

  return getNobleDialog(noble, user);
}
