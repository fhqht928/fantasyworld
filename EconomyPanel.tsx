// EconomyPanel.tsx

import useSWR from "swr";
import axios from "axios";

export default function EconomyPanel({ cityId }) {
  const { data } = useSWR(`/api/economy/${cityId}`, (url) => axios.get(url).then(res => res.data));

  return (
    <div className="p-4 bg-white border rounded-xl">
      <h2 className="text-lg font-bold">현재 물가 정보</h2>
      <ul>
        {data?.map((item, i) => (
          <li key={i}>
            🛒 {item.item}: {item.price} G (수요: {item.demand}, 공급: {item.supply})
          </li>
        ))}
      </ul>
    </div>
  );
}
