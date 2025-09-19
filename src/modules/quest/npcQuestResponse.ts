// src/modules/quest/npcQuestResponse.ts

export function getQuestResponse(taken: boolean, takerName?: string) {
  if (taken) {
    return takerName
      ? `그 퀘스트는 이미 ${takerName}님이 수주했습니다. 다른 요청은 없을까요?`
      : `이미 어떤 모험가가 수주해 갔어요.`;
  } else {
    return `좋습니다. 당신에게 맡기겠습니다. 이 퀘스트를 받아주세요.`;
  }
}
