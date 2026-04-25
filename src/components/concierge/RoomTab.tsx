import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";

const SCENES = [
  { key: "morning", label: "Утро", ico: "☀️" },
  { key: "work", label: "Работа", ico: "💼" },
  { key: "relax", label: "Отдых", ico: "🌿" },
  { key: "sleep", label: "Сон", ico: "🌙" },
];

export function RoomTab() {
  const [temp, setTemp] = useState(21);
  const [light, setLight] = useState(70);
  const [curtains, setCurtains] = useState(40);
  const [scene, setScene] = useState("relax");

  const applyScene = (k: string) => {
    setScene(k);
    if (k === "morning") { setTemp(22); setLight(85); setCurtains(95); }
    if (k === "work") { setTemp(21); setLight(95); setCurtains(70); }
    if (k === "relax") { setTemp(22); setLight(45); setCurtains(40); }
    if (k === "sleep") { setTemp(20); setLight(5); setCurtains(0); }
  };

  return (
    <div className="overflow-y-auto h-full p-4 space-y-4">
      <div>
        <div className="font-display text-base mb-2">Сцены</div>
        <div className="grid grid-cols-2 gap-2">
          {SCENES.map(s => (
            <button key={s.key} onClick={() => applyScene(s.key)}
              className={`p-4 rounded-xl border text-left transition ${scene === s.key ? "border-[var(--gold)] bg-[var(--gold-soft)] shadow-elegant" : "border-[var(--line)] bg-white hover:border-[var(--gold)]/50"}`}>
              <div className="text-2xl">{s.ico}</div>
              <div className="font-display text-base mt-1">{s.label}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white border border-[var(--line)] rounded-xl p-5 shadow-soft">
        <div className="text-[10px] uppercase tracking-wider text-[var(--navy)]/50">Климат</div>
        <div className="font-display text-6xl text-[var(--navy)] my-1">{temp}°C</div>
        <Slider value={[temp]} onValueChange={([v]) => setTemp(v)} min={16} max={28} step={1} className="mt-3" />
        <div className="flex justify-between text-[10px] font-mono text-[var(--navy)]/50 mt-1"><span>16°</span><span>28°</span></div>
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-[var(--line)]">
          <span className="text-sm">❄️ Кондиционер</span>
          <Switch defaultChecked />
        </div>
      </div>

      <div className="bg-white border border-[var(--line)] rounded-xl p-4 shadow-soft space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-2"><span>💡 Освещение</span><span className="font-mono text-xs">{light}%</span></div>
          <Slider value={[light]} onValueChange={([v]) => setLight(v)} max={100} />
        </div>
        <div>
          <div className="flex justify-between text-sm mb-2"><span>🪟 Шторы</span><span className="font-mono text-xs">{curtains}%</span></div>
          <Slider value={[curtains]} onValueChange={([v]) => setCurtains(v)} max={100} />
        </div>
      </div>

      <div className="bg-white border border-[var(--line)] rounded-xl p-4 shadow-soft space-y-3">
        <div className="flex items-center justify-between"><span className="text-sm">🔇 Не беспокоить</span><Switch /></div>
        <div className="flex items-center justify-between"><span className="text-sm">🎵 Фоновая музыка (Джаз)</span><Switch defaultChecked /></div>
      </div>
    </div>
  );
}
