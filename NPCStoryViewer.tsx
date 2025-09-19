// NPCStoryViewer.tsx

import useSWR from "swr";
import axios from "axios";

export default function NPCStoryViewer({ npcId }) {
  const { data } = useSWR(`/api/npc/${npcId}/story`, (url) => axios.get(url).then(res => res.data));

  return (
    <div className="p-4 bg-white rounded-xl">
      <h2 className="text-xl font-bold">📖 NPC의 인생 이야기</h2>
      {data?.map((s, i) => (
        <div key={i} className="mb-3">
          <h3 className="font-semibold">{s.title}</h3>
          <p className="text-sm text-gray-600">{s.summary}</p>
        </div>
      ))}
    </div>
  );
}
