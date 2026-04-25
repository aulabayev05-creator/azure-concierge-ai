import { Download, Star } from "lucide-react";
import { GUEST, ITINERARY, RECENT_CHARGES, STAY_HISTORY } from "@/lib/guest";

export function StayTab() {
  const pct = Math.round((GUEST.dayOf / GUEST.totalDays) * 100);
  const loyaltyPct = Math.round((GUEST.points / GUEST.nextTier) * 100);

  const exportData = () => {
    const blob = new Blob([JSON.stringify({ guest: GUEST, itinerary: ITINERARY, charges: RECENT_CHARGES, history: STAY_HISTORY }, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `azure-stay-${GUEST.lastName}.json`; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="overflow-y-auto h-full">
      <div className="bg-gradient-navy text-cream p-5">
        <div className="text-[10px] tracking-[0.25em] uppercase text-[var(--gold)]">Ваше пребывание</div>
        <h2 className="font-display text-3xl italic">Номер {GUEST.room} · {GUEST.suite}</h2>
      </div>

      <div className="p-4 space-y-4">
        {/* Dates */}
        <div className="bg-white border border-[var(--line)] rounded-xl p-4 shadow-soft">
          <div className="flex items-center justify-between text-sm">
            <div>
              <div className="text-[10px] uppercase tracking-wider text-[var(--navy)]/50">Заезд</div>
              <div className="font-display text-xl">{GUEST.checkIn}</div>
            </div>
            <div className="flex-1 mx-4 gold-line" />
            <div className="text-right">
              <div className="text-[10px] uppercase tracking-wider text-[var(--navy)]/50">Выезд</div>
              <div className="font-display text-xl">{GUEST.checkOut}</div>
            </div>
          </div>
          <div className="mt-3 h-1.5 bg-[var(--line)] rounded-full overflow-hidden">
            <div className="h-full bg-gradient-gold" style={{ width: `${pct}%` }} />
          </div>
          <div className="text-[11px] text-[var(--navy)]/60 mt-1.5 font-mono">День {GUEST.dayOf} из {GUEST.totalDays} · {pct}% завершено</div>
        </div>

        {/* Loyalty card */}
        <div className="rounded-xl p-5 bg-gradient-navy text-cream shadow-elegant relative overflow-hidden">
          <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-gradient-gold opacity-20 blur-2xl" />
          <div className="flex items-center justify-between relative">
            <div>
              <div className="text-[10px] tracking-[0.25em] uppercase text-[var(--gold)] flex items-center gap-1.5"><Star className="h-3 w-3 fill-[var(--gold)]" /> {GUEST.tier} TIER</div>
              <div className="font-display text-2xl mt-0.5">{GUEST.firstName} {GUEST.lastName}</div>
              <div className="font-mono text-xs text-cream/60 mt-1">{GUEST.points.toLocaleString("ru-RU")} баллов</div>
            </div>
          </div>
          <div className="mt-4 h-1.5 bg-cream/15 rounded-full overflow-hidden relative">
            <div className="h-full bg-gradient-gold" style={{ width: `${loyaltyPct}%` }} />
          </div>
          <div className="text-[11px] text-cream/70 mt-1.5 font-mono flex justify-between">
            <span>{GUEST.points.toLocaleString("ru-RU")} / {GUEST.nextTier.toLocaleString("ru-RU")}</span>
            <span>{(GUEST.nextTier - GUEST.points).toLocaleString("ru-RU")} до Platinum</span>
          </div>
        </div>

        {/* Itinerary */}
        <div className="bg-white border border-[var(--line)] rounded-xl p-4 shadow-soft">
          <div className="font-display text-base mb-2">Маршрут дня</div>
          <div className="space-y-2.5">
            {ITINERARY.map((i, idx) => (
              <div key={idx} className={`flex gap-3 items-start p-2 rounded-lg ${i.status === "active" ? "border border-[var(--gold)]/40 bg-[var(--gold-soft)]/40" : ""}`}>
                <div className="font-mono text-xs text-[var(--gold-deep)] mt-0.5 w-12 shrink-0">{i.time}</div>
                <div className="flex-1 text-sm text-[var(--navy)]">
                  {i.status === "done" && "✓ "}{i.status === "active" && "◐ "}{i.text}
                  {i.status === "rec" && <span className="ml-1 text-[10px] text-[var(--gold-deep)] font-mono">(рекомендация)</span>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Preferences grid */}
        <div className="bg-white border border-[var(--line)] rounded-xl p-4 shadow-soft">
          <div className="font-display text-base mb-3">Предпочтения</div>
          <div className="grid grid-cols-3 gap-2 text-xs">
            {[
              ["Кухня", GUEST.preferences.cuisine],
              ["Подушка", GUEST.preferences.pillow],
              ["Кофе", GUEST.preferences.coffee],
              ["Температура", `${GUEST.preferences.temp}°C`],
              ["Музыка", GUEST.preferences.music],
              ["Будильник", GUEST.preferences.wakeup],
            ].map(([k, v]) => (
              <div key={k} className="bg-[var(--cream)] rounded-lg p-2 border border-[var(--line)]">
                <div className="text-[9px] uppercase tracking-wider text-[var(--navy)]/50">{k}</div>
                <div className="text-[var(--navy)] mt-0.5 font-medium">{v}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Charges */}
        <div className="bg-white border border-[var(--line)] rounded-xl p-4 shadow-soft">
          <div className="font-display text-base mb-2">Свежие списания</div>
          <div className="divide-y divide-[var(--line)]">
            {RECENT_CHARGES.map((c, i) => (
              <div key={i} className="flex justify-between py-2 text-sm">
                <span className="text-[var(--navy)]/80">{c.name}</span>
                <span className="font-mono">${c.amount}</span>
              </div>
            ))}
          </div>
        </div>

        {/* History */}
        <div className="bg-white border border-[var(--line)] rounded-xl p-4 shadow-soft">
          <div className="font-display text-base mb-2">История визитов</div>
          <div className="space-y-1.5">
            {STAY_HISTORY.map((h, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span>{h.hotel}</span>
                <span className="font-mono text-[var(--gold-deep)]">${h.spent.toLocaleString("ru-RU")}</span>
              </div>
            ))}
          </div>
        </div>

        <button onClick={exportData} className="w-full flex items-center justify-center gap-2 py-2.5 border border-[var(--line)] rounded-xl text-sm hover:bg-white">
          <Download className="h-4 w-4" /> Экспортировать данные (JSON)
        </button>
      </div>
    </div>
  );
}
