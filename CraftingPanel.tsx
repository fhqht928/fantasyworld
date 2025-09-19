// CraftingPanel.tsx

import useSWR from "swr";
import axios from "axios";
import { useState } from "react";

export default function CraftingPanel() {
  const { data: recipes } = useSWR("/api/recipes", (url) => axios.get(url).then(res => res.data));
  const [result, setResult] = useState(null);

  const craft = async (recipeId: number) => {
    const res = await axios.post("/api/craft", { recipeId });
    setResult(res.data);
  };

  return (
    <div className="p-4 bg-white border rounded-xl">
      <h2 className="text-lg font-bold">⚒️ 제작</h2>
      {recipes?.map((r) => (
        <div key={r.id}>
          {r.name} (난이도: {r.difficulty}) <button onClick={() => craft(r.id)}>제작</button>
        </div>
      ))}
      {result && (
        <div className="mt-2">
          {result.success ? `✅ ${result.item.name} (품질: ${result.item.quality}) 제작 성공` : "❌ 실패"}
        </div>
      )}
    </div>
  );
}
