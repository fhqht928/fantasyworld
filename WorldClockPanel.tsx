// WorldClockPanel.tsx

import useSWR from "swr";
import axios from "axios";

export default function WorldClockPanel() {
  const { data } = useSWR("/api/world/time", (url) => axios.get(url).then(res => res.data));

  return (
    <div className="p-4 bg-sky-50 border rounded-xl">
      <h2 className="text-lg font-bold">🌤️ 세계 시계</h2>
      <p>🕒 시간: {data?.hour}시</p>
      <p>🍂 계절: {data?.season}</p>
      <p>🌦️ 날씨: {data?.weather}</p>
      <p>🌙 밤인가요? {data?.isNight ? "예" : "아니오"}</p>
    </div>
  );
}
