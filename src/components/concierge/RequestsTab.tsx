import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { REQUEST_LABELS } from "@/lib/guest";
import { Inbox } from "lucide-react";

interface Req {
  id: string; type: string; stage: string; created_at: string; rating: number | null;
}

export function RequestsTab({ refreshKey }: { refreshKey: number }) {
  const [items, setItems] = useState<Req[]>([]);

  useEffect(() => {
    supabase.from("requests").select("*").order("created_at", { ascending: false }).then(({ data }) => {
      if (data) setItems(data as any);
    });
  }, [refreshKey]);

  const total = items.length;
  const active = items.filter(i => i.stage !== "done").length;
  const done = items.filter(i => i.stage === "done").length;

  return (
    <div className="overflow-y-auto h-full p-4">
      <div className="grid grid-cols-3 gap-2 mb-4">
        <Tile label="Всего" value={total} tone="navy" />
        <Tile label="Активных" value={active} tone="gold" />
        <Tile label="Завершено" value={done} tone="green" />
      </div>

      {items.length === 0 ? (
        <div className="text-center py-16 text-[var(--navy)]/50">
          <Inbox className="h-10 w-10 mx-auto mb-3 text-[var(--gold)]/50" />
          <p className="font-display italic text-base">Активных заявок пока нет</p>
          <p className="text-xs mt-1">Отправьте запрос из чата</p>
        </div>
      ) : (
        <div className="space-y-2">
          {items.map(r => (
            <div key={r.id} className="bg-white border border-[var(--line)] rounded-xl p-3 shadow-soft flex items-center justify-between">
              <div>
                <div className="text-[10px] font-mono text-[var(--navy)]/50">#{r.id.slice(0, 6).toUpperCase()}</div>
                <div className="font-display text-base">{REQUEST_LABELS[r.type] ?? r.type}</div>
                <div className="text-[11px] text-[var(--navy)]/60 mt-0.5">{new Date(r.created_at).toLocaleString("ru-RU")}</div>
              </div>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${r.stage === "done" ? "bg-emerald-100 text-emerald-700" : "bg-[var(--gold-soft)] text-[var(--gold-deep)]"}`}>
                {r.stage === "done" ? "Завершено" : "В работе"}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Tile({ label, value, tone }: { label: string; value: number; tone: "navy" | "gold" | "green" }) {
  const map = {
    navy: "bg-gradient-navy text-cream",
    gold: "bg-gradient-gold text-[var(--navy)]",
    green: "bg-emerald-600 text-white",
  };
  return (
    <div className={`rounded-xl p-3 shadow-soft ${map[tone]}`}>
      <div className="text-[10px] uppercase tracking-wider opacity-80">{label}</div>
      <div className="font-display text-3xl mt-1 leading-none">{value}</div>
    </div>
  );
}
