// src/modules/world/worldTimeSync.ts

export function getGameWorldTime(useRealTime = false) {
  const now = new Date();

  if (useRealTime) {
    // 현실 세계 시간 사용
    return {
      hour: now.getHours(),
      minute: now.getMinutes(),
      season: getSeason(now.getMonth() + 1),
      isNight: now.getHours() < 6 || now.getHours() >= 20,
    };
  }

  // 서버 기준 시간 (예: 10분 = 하루)
  const gameMinutes = Math.floor(Date.now() / (1000 * 60));
  const gameDays = gameMinutes / 10;
  const gameHours = Math.floor(gameDays * 24) % 24;

  return {
    hour: gameHours,
    minute: 0,
    season: getSeason((Math.floor(gameDays / 90) % 4) + 1),
    isNight: gameHours < 6 || gameHours >= 20,
  };
}

function getSeason(month: number): "봄" | "여름" | "가을" | "겨울" {
  if ([3, 4, 5].includes(month)) return "봄";
  if ([6, 7, 8].includes(month)) return "여름";
  if ([9, 10, 11].includes(month)) return "가을";
  return "겨울";
}
