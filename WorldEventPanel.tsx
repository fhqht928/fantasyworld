// WorldEventPanel.tsx

import useSWR from "swr";
import axios from "axios";

export default function WorldEventPanel() {
  const { data } = useSWR("/api/world-events", (url) => axios.get(url).then(res => res.data));

  return (
    <div className="p-4 bg-yellow-50 border rounded-xl">
      <h2 className="text-xl font-bold">🌍 현재 발생 중인 세계 사건</h2>
      {data?.map((event, i) => (
        <div key={i} className="mb-2">
          <strong>{event.title}</strong> ({event.type})<br />
          📍 영향 지역: {event.affectedRegion}<br />
          ⏱️ 지속일: {event.durationDays}일<br />
          💥 영향: {event.impact}
        </div>
      ))}
    </div>
  );
}
