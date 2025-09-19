// src/modules/dialog/nobleDialog.ts

export function getNobleDialog(noble: any, user: any) {
  const { personality, fame: userFame, notoriety: userNotoriety } = user;
  const { name: nobleName, nobleTitle } = noble;

  if (userFame >= 50 && personality !== "교만") {
    return `${nobleTitle} ${nobleName}: 훌륭한 명성을 지닌 자로군. 나의 일을 맡겨보지.`;
  }

  if (userNotoriety >= 30 && personality === "냉정") {
    return `${nobleTitle} ${nobleName}: 넌 위험한 인물이다. 가까이 하지 마라.`;
  }

  if (userFame < 10 && personality === "교만") {
    return `${nobleTitle} ${nobleName}: 누군가 했더니, 하찮은 자로군.`;
  }

  if (personality === "공정") {
    return `${nobleTitle} ${nobleName}: 나는 명성에 연연하지 않는다. 실력으로 판단하겠다.`;
  }

  return `${nobleTitle} ${nobleName}: 나에겐 이유 없는 존중도, 이유 없는 멸시도 없다.`;
}
