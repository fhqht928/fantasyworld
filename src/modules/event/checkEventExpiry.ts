// src/modules/event/checkEventExpiry.ts

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function expirePastEvents() {
  const events = await prisma.globalEvent.findMany({
    where: { isActive: true },
  });

  const now = new Date();

  for (const event of events) {
    const daysPassed = Math.floor(
      (now.getTime() - new Date(event.startedAt).getTime()) / (1000 * 60 * 60 * 24),
    );

    if (daysPassed >= event.durationDays) {
      await prisma.globalEvent.update({
        where: { id: event.id },
        data: {
          isActive: false,
          endedAt: now,
        },
      });
    }
  }
}
