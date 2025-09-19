// EcosystemPanel.tsx

import useSWR from "swr";
import axios from "axios";

export default function EcosystemPanel({ areaId }) {
  const { data } = useSWR(`/api/ecosystem/${areaId}`, (url) => axios.get(url).then(res => res.data));

  return (
    <div className="p-4 bg-white rounded-xl">
      <h2 className="text-lg font-bold">생태계 현황</h2>
      <ul>
        {data?.map((animal, i) => (
          <li key={i}>
            🐾 {animal.species}: {animal.population}마리 ({animal.type === "predator" ? "포식자" : "초식"})
          </li>
        ))}
      </ul>
    </div>
  );
}
