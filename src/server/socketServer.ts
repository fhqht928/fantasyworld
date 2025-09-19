// src/server/socketServer.ts

import { Server } from "socket.io";
import http from "http";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export function createSocketServer(server: http.Server) {
  const io = new Server(server, {
    cors: { origin: "*" },
  });

  io.on("connection", (socket) => {
    console.log("🧍 유저 접속:", socket.id);

    socket.on("playerMove", async (data) => {
      await prisma.user.update({
        where: { id: data.userId },
        data: {
          positionX: data.x,
          positionY: data.y,
        },
      });

      // 전체 유저에게 브로드캐스트
      socket.broadcast.emit("playerMoved", {
        userId: data.userId,
        x: data.x,
        y: data.y,
      });
    });

    socket.on("chatMessage", (msg) => {
      io.emit("chatMessage", msg); // 전체 채팅
    });

    socket.on("disconnect", () => {
      console.log("❌ 유저 연결 종료:", socket.id);
    });
  });
}
