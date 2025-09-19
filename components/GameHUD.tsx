// components/GameHUD.tsx

import StatusBar from "./StatusBar";
import InventoryPanel from "./InventoryPanel";
import StatusPanel from "./StatusPanel";
import OptionsMenu from "./OptionsMenu";

export default function GameHUD({ user, hp, mp, items }) {
  return (
    <div className="fixed top-0 left-0 w-full h-full p-4 pointer-events-none">
      <div className="flex justify-between">
        <div className="pointer-events-auto space-y-4">
          <StatusBar hp={hp} maxHp={user.maxHp} mp={mp} maxMp={user.maxMp} />
          <StatusPanel user={user} />
        </div>
        <div className="pointer-events-auto space-y-4">
          <InventoryPanel items={items} />
          <OptionsMenu />
        </div>
      </div>
    </div>
  );
}
