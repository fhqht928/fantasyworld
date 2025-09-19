// MultiplayerSocket.tsx

import { useEffect } from "react";
import { io } from "socket.io-client";

export default function MultiplayerSocket({ userId }) {
  useEffect(() => {
    const socket = io("http://localhost:3000");

    socket.on("connect", () => {
      console.log("서버 연결 완료");
    });

    socket.on("playerMoved", (data) => {
      console.log("다른 플레이어 이동:", data);
      // 화면에 반영
    });

    socket.on("chatMessage", (msg) => {
      console.log("채팅 도착:", msg);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return null;
}
