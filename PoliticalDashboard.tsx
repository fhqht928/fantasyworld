// PoliticalDashboard.tsx

import useSWR from "swr";
import axios from "axios";

export default function PoliticalDashboard() {
  const { data } = useSWR("/api/player/title", (url) => axios.get(url).then(res => res.data));

  if (!data) return <p>정치 권한이 없습니다.</p>;

  return (
    <div className="p-4 bg-white rounded-xl">
      <h2 className="text-xl font-bold">🎖️ 당신의 정치 직위</h2>
      <p>직위: {data.type}</p>
      <p>관할 지역: {data.region}</p>
      <p>영향력: {data.authority}/100</p>
    </div>
  );
}
