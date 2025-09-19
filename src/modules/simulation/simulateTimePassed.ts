// src/modules/simulation/simulateTimePassed.ts

import { simulateNPCYear } from "../npc/npcLifecycle";
import { simulateWeather } from "../world/weatherSimulation";
import { updateEconomy } from "../economy/economyEngine";

export async function simulateTimePassed(minutesPassed: number) {
  const days = Math.floor(minutesPassed / 10); // 10분 = 1일로 가정

  for (let i = 0; i < days; i++) {
    await simulateNPCYear();      // NPC 생애 변화
    await simulateWeather();      // 날씨 변화
    await updateEconomy();        // 경제 변동
  }
}
