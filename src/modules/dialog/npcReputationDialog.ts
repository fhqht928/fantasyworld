// src/modules/dialog/npcReputationDialog.ts

export function getReputationComment(fame: number, notoriety: number, npcMood: string) {
  if (fame >= 50) return "당신의 명성은 정말 대단하군요. 저도 듣기만 했습니다!";
  if (notoriety >= 30) return "당신이 그 유명한 문제 인물인가요? 조심해야겠네요...";
  if (npcMood === "curious") return "당신에 대해 좀 더 알고 싶군요.";

  return "어서 오세요, 낯선 분이군요.";
}
