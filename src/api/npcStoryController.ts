// src/api/npcStoryController.ts

import express from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

router.get("/npc/:id/story", async (req, res) => {
  const stories = await prisma.nPCStory.findMany({
    where: { npcId: parseInt(req.params.id) },
    orderBy: { createdAt: "desc" },
  });

  res.json(stories);
});

export default router;
