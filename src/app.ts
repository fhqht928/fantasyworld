// src/app.ts

import express from "express";
import http from "http";
import { createSocketServer } from "./server/socketServer";

const app = express();
const server = http.createServer(app);
createSocketServer(server);

server.listen(3000, () => {
  console.log("🌐 웹 서버 및 실시간 서버 실행 중: http://localhost:3000");
});
