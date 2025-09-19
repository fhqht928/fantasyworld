// components/StatusPanel.tsx

export default function StatusPanel({ user }) {
  return (
    <div className="p-4 bg-white rounded-xl shadow">
      <h2 className="text-xl font-bold mb-2">🧑 내 상태</h2>
      <p>이름: {user.username}</p>
      <p>레벨: {user.level}</p>
      <p>직업: {user.job}</p>
      <p>명성: {user.reputation}</p>
      <p>악명: {user.notoriety}</p>
    </div>
  );
}
