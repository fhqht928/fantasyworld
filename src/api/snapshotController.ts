// src/api/snapshotController.ts

import express from "express";
import { createWorldSnapshot } from "../modules/world/worldSnapshotSaver";
import { restoreWorldSnapshot } from "../modules/world/worldSnapshotRestorer";

const router = express.Router();

router.post("/snapshot/save", async (req, res) => {
  const label = new Date().toISOString().replace(/[:.]/g, "-");
  const result = await createWorldSnapshot(label);
  res.json(result);
});

router.post("/snapshot/load/:id", async (req, res) => {
  const result = await restoreWorldSnapshot(parseInt(req.params.id));
  res.json(result);
});

export default router;
