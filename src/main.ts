// src/main.ts

import express from "express";
import { updateWorldTime } from "./modules/world/worldClock";

const app = express();
const port = 3000;

app.listen(port, async () => {
  console.log(`서버 시작됨: 포트 ${port}`);
  await updateWorldTime(); // 시작 시 시간 업데이트 및 경과 처리
});
