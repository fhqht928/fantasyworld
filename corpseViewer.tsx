// CorpseViewer.tsx

export default function CorpseViewer({ corpse }) {
  return (
    <div className="p-2 border rounded bg-neutral-100">
      🪦 시체 ({corpse.type}) - {corpse.decayStage}
      <br />
      📍 위치: {corpse.location}
      {corpse.isWaterlogged && <p>💧 물에 젖어 있음</p>}
    </div>
  );
}
