// src/main.ts

import "dotenv/config";
import "./app";
import { GameEngine } from "./modules/game/gameEngine";

async function bootstrap() {
  const engine = new GameEngine({
    realMinutesPerTick: 1, // 로컬 개발 시 빠르게 세계가 변화하도록 1분마다 틱 실행
    globalEventChance: 0.2,
  });

  await engine.bootstrap();
  engine.start();

  const shutdown = async () => {
    await engine.shutdown();
    process.exit(0);
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

bootstrap().catch((error) => {
  console.error("❌ 게임 서버 초기화 실패", error);
  process.exit(1);
});
