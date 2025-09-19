// components/OptionsMenu.tsx

export default function OptionsMenu() {
  return (
    <div className="p-4 bg-gray-100 rounded-xl shadow space-y-2">
      <h2 className="text-lg font-bold">⚙️ 설정</h2>
      <button className="w-full py-1 px-2 bg-white rounded border">그래픽 설정</button>
      <button className="w-full py-1 px-2 bg-white rounded border">소리 설정</button>
      <button className="w-full py-1 px-2 bg-white rounded border">게임 저장</button>
      <button className="w-full py-1 px-2 bg-white rounded border text-red-500">게임 종료</button>
    </div>
  );
}
