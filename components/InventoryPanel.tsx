// components/InventoryPanel.tsx

export default function InventoryPanel({ items }) {
  return (
    <div className="p-4 bg-neutral-100 rounded-xl shadow">
      <h2 className="text-lg font-bold mb-2">🎒 인벤토리</h2>
      <div className="grid grid-cols-4 gap-2">
        {items.map((item, i) => (
          <div key={i} className="p-2 border rounded bg-white text-sm">
            <p className="font-semibold">{item.name}</p>
            <p>품질: {item.quality}</p>
            <p>수량: {item.quantity}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
