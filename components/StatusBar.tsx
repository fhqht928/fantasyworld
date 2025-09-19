// components/StatusBar.tsx

export default function StatusBar({ hp, maxHp, mp, maxMp }) {
  const hpPercent = (hp / maxHp) * 100;
  const mpPercent = (mp / maxMp) * 100;

  return (
    <div className="w-full p-2 space-y-1">
      <div className="bg-red-200 rounded h-4 relative">
        <div className="bg-red-500 h-full rounded" style={{ width: `${hpPercent}%` }} />
        <span className="absolute text-xs text-white left-2">{hp} / {maxHp} HP</span>
      </div>
      <div className="bg-blue-200 rounded h-4 relative">
        <div className="bg-blue-500 h-full rounded" style={{ width: `${mpPercent}%` }} />
        <span className="absolute text-xs text-white left-2">{mp} / {maxMp} MP</span>
      </div>
    </div>
  );
}
