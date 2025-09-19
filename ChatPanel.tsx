// ChatPanel.tsx (React 예시)

import { useState } from "react";
import axios from "axios";

export default function ChatPanel({ npcId, userName }) {
  const [input, setInput] = useState("");
  const [chat, setChat] = useState<string[]>([]);

  const sendMessage = async () => {
    const res = await axios.post("/api/npc-chat", {
      npcId,
      userMessage: input,
      userName,
    });
    setChat((prev) => [...prev, `🙍 ${input}`, `🧙 ${res.data.reply}`]);
    setInput("");
  };

  return (
    <div className="p-4 border rounded-xl bg-white">
      {chat.map((line, i) => (
        <div key={i}>{line}</div>
      ))}
      <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="말 걸기..." />
      <button onClick={sendMessage}>보내기</button>
    </div>
  );
}
