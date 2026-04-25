import { useState } from "react";
import { Minus, Plus, Calendar, Cloud, Wind, Droplets, Sun, MapPin, CreditCard, Check } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

const DINING_MENU = [
  { id: 1, name: "Тальятелле с трюфелем", price: 28 },
  { id: 2, name: "Бранзино на гриле", price: 34 },
  { id: 3, name: "Капрезе с буйволиной моцареллой", price: 18 },
  { id: 4, name: "Ризотто с шафраном", price: 24 },
  { id: 5, name: "Тирамису", price: 12 },
  { id: 6, name: "Эспрессо двойной", price: 6 },
  { id: 7, name: "Бокал Просекко", price: 14 },
  { id: 8, name: "Минеральная вода 0.75л", price: 8 },
];

const SPA_SERVICES = [
  { id: 1, name: "Шведский массаж 60 мин", price: 180 },
  { id: 2, name: "Стоунтерапия 90 мин", price: 240 },
  { id: 3, name: "Аромафейшл 75 мин", price: 160 },
  { id: 4, name: "Двойной массаж 60 мин", price: 320 },
  { id: 5, name: "Маникюр + педикюр", price: 110 },
];

const SLOTS = ["14:00", "15:30", "16:00", "17:30", "18:00", "19:00", "20:00"];

export function DiningCard({ onConfirm }: { onConfirm: (total: number) => void }) {
  const [qty, setQty] = useState<Record<number, number>>({});
  const total = DINING_MENU.reduce((s, i) => s + (qty[i.id] || 0) * i.price, 0);
  return (
    <div className="rounded-xl border border-[var(--line)] bg-white p-3.5 mt-2 shadow-soft">
      <div className="flex items-center justify-between mb-2">
        <div className="font-display text-base">Меню рум-сервиса</div>
        <Badge variant="outline" className="text-[10px] font-mono">ITALIANO</Badge>
      </div>
      <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
        {DINING_MENU.map(item => {
          const q = qty[item.id] || 0;
          return (
            <div key={item.id} className="flex items-center justify-between text-sm py-1 border-b border-[var(--line)]/50 last:border-0">
              <div className="min-w-0 flex-1">
                <div className="text-[var(--navy)] truncate">{item.name}</div>
                <div className="text-[11px] text-[var(--navy)]/50 font-mono">${item.price}</div>
              </div>
              <div className="flex items-center gap-1.5">
                <button onClick={() => setQty(p => ({ ...p, [item.id]: Math.max(0, q - 1) }))} className="h-6 w-6 rounded-full border border-[var(--line)] flex items-center justify-center hover:bg-[var(--gold-soft)]"><Minus className="h-3 w-3" /></button>
                <span className="w-5 text-center text-xs font-mono">{q}</span>
                <button onClick={() => setQty(p => ({ ...p, [item.id]: q + 1 }))} className="h-6 w-6 rounded-full border border-[var(--line)] flex items-center justify-center hover:bg-[var(--gold-soft)]"><Plus className="h-3 w-3" /></button>
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-[var(--line)]">
        <div className="text-xs text-[var(--navy)]/60">Итого</div>
        <div className="font-mono font-medium">${total}</div>
      </div>
      <button
        disabled={total === 0}
        onClick={() => { onConfirm(total); toast.success("Бронирование подтверждено", { description: `Меню питания · $${total}` }); }}
        className="w-full mt-2.5 bg-gradient-navy text-cream rounded-lg py-2 text-sm font-medium hover:opacity-90 transition disabled:opacity-40"
      >
        Подтвердить · ${total || 0}
      </button>
    </div>
  );
}

export function SpaCard({ onConfirm }: { onConfirm: (svc: string, slot: string) => void }) {
  const [selected, setSelected] = useState<number | null>(1);
  const [slot, setSlot] = useState("16:00");
  const svc = SPA_SERVICES.find(s => s.id === selected);
  return (
    <div className="rounded-xl border border-[var(--line)] bg-white p-3.5 mt-2 shadow-soft">
      <div className="font-display text-base mb-2">Спа-меню</div>
      <div className="space-y-1.5 mb-3">
        {SPA_SERVICES.map(s => (
          <button key={s.id} onClick={() => setSelected(s.id)}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg border text-sm text-left transition ${selected === s.id ? "border-[var(--gold)] bg-[var(--gold-soft)]" : "border-[var(--line)] hover:bg-[var(--cream)]"}`}>
            <span>{s.name}</span>
            <span className="font-mono text-xs">${s.price}</span>
          </button>
        ))}
      </div>
      <div className="text-[10px] uppercase tracking-wider text-[var(--navy)]/50 mb-1.5">Сегодня · доступные слоты</div>
      <div className="flex gap-1.5 overflow-x-auto pb-1 mb-3 edge-fade">
        {SLOTS.map(s => (
          <button key={s} onClick={() => setSlot(s)}
            className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-mono border transition ${slot === s ? "bg-[var(--navy)] text-cream border-[var(--navy)]" : "border-[var(--line)] hover:border-[var(--gold)]"}`}>
            {s}
          </button>
        ))}
      </div>
      <button onClick={() => { if (svc) { onConfirm(svc.name, slot); toast.success("Спа забронировано", { description: `${svc.name} · ${slot}` }); } }}
        className="w-full bg-gradient-navy text-cream rounded-lg py-2 text-sm font-medium hover:opacity-90 transition">
        Забронировать · {slot}
      </button>
    </div>
  );
}

export function ReservationCard({ title = "Osteria del Mare", meta = "Сегодня · 19:30 · 2 гостя · Стол с видом на океан" }) {
  return (
    <div className="rounded-xl border border-[var(--line)] bg-white p-3.5 mt-2 shadow-soft">
      <div className="flex items-start gap-3">
        <div className="h-10 w-10 rounded-lg bg-gradient-gold-soft flex items-center justify-center"><Calendar className="h-5 w-5 text-[var(--gold-deep)]" /></div>
        <div className="flex-1 min-w-0">
          <div className="font-display text-base">{title}</div>
          <div className="text-xs text-[var(--navy)]/60 mt-0.5">{meta}</div>
        </div>
      </div>
      <button onClick={() => toast.success("Бронирование подтверждено", { description: meta })}
        className="w-full mt-3 bg-gradient-navy text-cream rounded-lg py-2 text-sm font-medium hover:opacity-90 transition">
        Подтвердить бронирование
      </button>
    </div>
  );
}

export function WeatherCard() {
  return (
    <div className="rounded-xl bg-gradient-navy text-cream p-4 mt-2 shadow-elegant overflow-hidden relative">
      <div className="absolute top-3 right-3 opacity-20"><Sun className="h-16 w-16" /></div>
      <div className="text-[11px] uppercase tracking-[0.2em] text-cream/60">Амальфи · сейчас</div>
      <div className="font-display text-5xl mt-1 leading-none">24°</div>
      <div className="text-sm italic text-cream/80 mt-1">Ясно, лёгкий бриз</div>
      <div className="grid grid-cols-3 gap-3 mt-4 text-xs">
        <div className="flex items-center gap-1.5"><Wind className="h-3 w-3" /><span className="font-mono">12 км/ч</span></div>
        <div className="flex items-center gap-1.5"><Droplets className="h-3 w-3" /><span className="font-mono">58%</span></div>
        <div className="flex items-center gap-1.5"><Cloud className="h-3 w-3" /><span className="font-mono">UV 6</span></div>
      </div>
    </div>
  );
}

const ITINERARY_TODAY = [
  { time: "16:00", text: "Спа — Шведский массаж" },
  { time: "18:00", text: "Аперитив на крыше Sky Lounge" },
  { time: "19:30", text: "Ужин — Osteria del Mare" },
  { time: "22:00", text: "Прогулка прибрежной тропой" },
];

export function ItineraryCard() {
  return (
    <div className="rounded-xl border border-[var(--line)] bg-white p-3.5 mt-2 shadow-soft">
      <div className="font-display text-base mb-2">План на сегодня</div>
      <div className="space-y-2">
        {ITINERARY_TODAY.map((i, idx) => (
          <div key={idx} className="flex gap-3 items-start">
            <div className="font-mono text-xs text-[var(--gold-deep)] mt-0.5 w-12 shrink-0">{i.time}</div>
            <div className="text-sm text-[var(--navy)]">{i.text}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function PaymentCard({ amount = 342 }: { amount?: number }) {
  const [state, setState] = useState<"idle" | "processing" | "done">("idle");
  return (
    <div className="rounded-xl border border-[var(--line)] bg-white p-4 mt-2 shadow-soft text-center">
      <div className="text-[11px] uppercase tracking-[0.2em] text-[var(--navy)]/50 mb-1">К оплате на номер 402</div>
      <div className="font-display text-5xl text-[var(--navy)] my-2">${amount}</div>
      {state === "idle" && (
        <button onClick={() => { setState("processing"); setTimeout(() => { setState("done"); toast.success("Платёж успешен", { description: `$${amount} списано на номер 402` }); }, 1800); }}
          className="w-full bg-gradient-gold text-[var(--navy)] rounded-lg py-2.5 text-sm font-medium hover:opacity-90 transition flex items-center gap-2 justify-center">
          <CreditCard className="h-4 w-4" /> Подтвердить списание
        </button>
      )}
      {state === "processing" && (
        <button disabled className="w-full bg-[var(--navy)]/60 text-cream rounded-lg py-2.5 text-sm font-medium">Обработка…</button>
      )}
      {state === "done" && (
        <div className="w-full bg-emerald-50 text-emerald-700 rounded-lg py-2.5 text-sm font-medium flex items-center gap-2 justify-center">
          <Check className="h-4 w-4" /> Оплачено
        </div>
      )}
    </div>
  );
}

const RECOS = [
  { name: "Sky Lounge 360", tag: "Крыша · Сегодня", img: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=400&q=80" },
  { name: "Голубой грот", tag: "Полдня · Лодка", img: "https://images.unsplash.com/photo-1505228395891-9a51e7e86bf6?w=400&q=80" },
  { name: "La Bottega", tag: "Траттория · 9 мин", img: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=400&q=80" },
  { name: "Прибрежная тропа", tag: "Закат · 45 мин", img: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80" },
];

export function RecosCard() {
  return (
    <div className="mt-2">
      <div className="flex gap-2 overflow-x-auto pb-2 edge-fade">
        {RECOS.map((r, i) => (
          <div key={i} className="shrink-0 w-[210px] rounded-xl overflow-hidden border border-[var(--line)] bg-white shadow-soft">
            <img src={r.img} alt={r.name} className="h-24 w-full object-cover" />
            <div className="p-2.5">
              <div className="text-sm font-medium text-[var(--navy)] truncate">{r.name}</div>
              <div className="text-[11px] text-[var(--navy)]/60 mt-0.5">{r.tag}</div>
              <button className="mt-2 text-[11px] text-[var(--gold-deep)] flex items-center gap-1 hover:underline">
                <MapPin className="h-3 w-3" /> Посмотреть
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
