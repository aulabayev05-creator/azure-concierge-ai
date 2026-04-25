import { Bell, Check, Sparkles, Star } from "lucide-react";
import { GUEST } from "@/lib/guest";
import { Badge } from "@/components/ui/badge";

export function WidgetHeader({
  language, setLanguage,
}: { language: string; setLanguage: (v: string) => void }) {
  return (
    <div className="bg-gradient-navy text-cream flex items-center justify-between px-4 h-14 rounded-t-2xl">
      <div className="flex items-center gap-3 min-w-0">
        <div className="relative">
          <div className="h-9 w-9 rounded-full bg-gradient-gold flex items-center justify-center text-base shadow-elegant animate-pulse-gold">
            🛎️
          </div>
          <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-[var(--navy)]" />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-display text-base leading-none">Azure Консьерж</span>
            <Badge className="bg-gradient-gold text-[var(--navy)] border-0 text-[10px] tracking-wider font-mono">CLAUDE AI</Badge>
          </div>
          <div className="text-[10px] uppercase tracking-[0.18em] text-cream/60 mt-1">УМНЫЙ · ВСЕГДА НА СВЯЗИ</div>
        </div>
      </div>
      <div className="flex items-center gap-1.5">
        <button className="h-8 w-8 rounded-full hover:bg-white/10 flex items-center justify-center transition" title="Уведомления">
          <Bell className="h-4 w-4" />
        </button>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="bg-white/10 text-cream rounded-md text-xs px-2 py-1 border-0 focus:ring-1 focus:ring-[var(--gold)] font-mono"
        >
          {["RU","EN","IT","FR","DE","ES","ZH","JA","AR","PT"].map(l => (
            <option key={l} value={l} className="text-[var(--navy)]">{l}</option>
          ))}
        </select>
      </div>
    </div>
  );
}

export function GuestStrip() {
  return (
    <div className="bg-gradient-gold-soft border-b border-[var(--line)] px-4 py-2.5 flex items-center justify-between text-xs">
      <div className="text-[var(--navy)]">
        <span className="font-medium">Добро пожаловать, г-н {GUEST.lastName}</span>
        <span className="text-[var(--navy)]/60"> · Номер {GUEST.room} · {GUEST.suite} · День {GUEST.dayOf} из {GUEST.totalDays}</span>
      </div>
      <Badge className="bg-[var(--navy)] text-[var(--gold)] border-0 font-mono text-[10px]">
        <Star className="h-3 w-3 mr-1 fill-[var(--gold)]" /> {GUEST.tier.toUpperCase()}
      </Badge>
    </div>
  );
}

export function PersonalBanner({ onOption }: { onOption: (a: string) => void }) {
  return (
    <div className="mx-4 mt-3 rounded-xl bg-gradient-gold-soft border border-[var(--gold)]/30 p-3.5 animate-fade-in-up">
      <div className="flex items-start gap-2.5">
        <Sparkles className="h-4 w-4 text-[var(--gold-deep)] mt-0.5 shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-[13px] text-[var(--navy)] leading-relaxed italic font-display">
            «Вчера вы наслаждались итальянской кухней — стол на крыше в Osteria del Mare освободился сегодня. Ваш обычный спа-сеанс также свободен в 16:00.»
          </p>
          <div className="flex flex-wrap gap-2 mt-2.5">
            <button onClick={() => onOption("recos")} className="text-[11px] bg-[var(--navy)] text-cream px-3 py-1.5 rounded-full hover:opacity-90 transition">
              Показать варианты
            </button>
            <button onClick={() => onOption("spa")} className="text-[11px] bg-white border border-[var(--gold)]/40 text-[var(--navy)] px-3 py-1.5 rounded-full hover:bg-[var(--gold-soft)] transition">
              Забронировать спа в 16:00
            </button>
            <button onClick={() => onOption("dismiss")} className="text-[11px] text-[var(--navy)]/60 px-3 py-1.5 hover:text-[var(--navy)] transition">
              Не сейчас
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function TypingIndicator() {
  return (
    <div className="flex gap-1 items-end h-4">
      <span className="h-1.5 w-1.5 rounded-full bg-[var(--navy)]/50 animate-typing-1" />
      <span className="h-1.5 w-1.5 rounded-full bg-[var(--navy)]/50 animate-typing-2" />
      <span className="h-1.5 w-1.5 rounded-full bg-[var(--navy)]/50 animate-typing-3" />
    </div>
  );
}

export function MessageBubble({
  role, content, time,
}: { role: "user" | "ai" | "staff"; content: React.ReactNode; time?: string }) {
  if (role === "ai") {
    return (
      <div className="flex gap-2 items-end animate-fade-in-up">
        <div className="h-7 w-7 rounded-full bg-gradient-gold flex items-center justify-center text-xs shrink-0">🛎️</div>
        <div className="max-w-[85%] bg-white border border-[var(--line)] text-[var(--navy)] px-3.5 py-2.5 rounded-2xl rounded-tl-sm shadow-soft text-sm leading-relaxed">
          {content}
          {time && <div className="text-[10px] text-[var(--navy)]/40 mt-1 font-mono">{time}</div>}
        </div>
      </div>
    );
  }
  if (role === "staff") {
    return (
      <div className="flex gap-2 items-end animate-fade-in-up">
        <div className="h-7 w-7 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-medium shrink-0">СР</div>
        <div className="max-w-[85%] bg-blue-50 border border-blue-200 text-[var(--navy)] px-3.5 py-2.5 rounded-2xl rounded-tl-sm text-sm leading-relaxed">
          <div className="text-[10px] text-blue-700 font-medium mb-0.5">София · Менеджер</div>
          {content}
        </div>
      </div>
    );
  }
  return (
    <div className="flex justify-end animate-fade-in-up">
      <div className="max-w-[85%] bg-gradient-navy text-cream px-3.5 py-2.5 rounded-2xl rounded-br-sm shadow-soft text-sm leading-relaxed">
        {content}
        {time && (
          <div className="text-[10px] text-cream/50 mt-1 flex items-center gap-1 justify-end font-mono">
            {time} <Check className="h-2.5 w-2.5" /><Check className="h-2.5 w-2.5 -ml-1.5" />
          </div>
        )}
      </div>
    </div>
  );
}
