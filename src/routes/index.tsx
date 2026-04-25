import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import { TopNav } from "@/components/TopNav";
import { ConciergeWidget } from "@/components/concierge/ConciergeWidget";
import { OperationsView } from "@/components/operations/OperationsView";
import { ArrowRight, Play } from "lucide-react";

export const Route = createFileRoute("/")({
  component: () => (
    <AuthProvider>
      <Home />
    </AuthProvider>
  ),
});

function Home() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [view, setView] = useState<"guest" | "ops">("guest");

  useEffect(() => { if (!loading && !user) navigate({ to: "/auth" }); }, [user, loading, navigate]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--cream)]">
        <div className="font-display italic text-[var(--navy)]/60">Подождите…</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--cream)]">
      <TopNav view={view} setView={setView} />
      {view === "ops" ? <OperationsView /> : <Landing />}
    </div>
  );
}

function Landing() {
  return (
    <main className="pt-16">
      {/* Hero */}
      <section className="grid lg:grid-cols-[1.1fr_0.9fr] min-h-[calc(100vh-4rem)]">
        {/* Left navy */}
        <div className="bg-gradient-navy text-cream p-8 lg:p-14 flex flex-col justify-center relative overflow-hidden">
          <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-gradient-gold opacity-15 blur-3xl" />
          <div className="absolute bottom-10 left-10 gold-line w-32" />
          <div className="relative max-w-xl">
            <div className="text-[10px] tracking-[0.35em] uppercase text-[var(--gold)] mb-6">Том IV · Весна 2026</div>
            <h1 className="font-display italic text-5xl md:text-6xl lg:text-[76px] leading-[0.95] text-balance">
              Искусство невысказанной просьбы.
            </h1>
            <p className="font-display italic text-xl md:text-[22px] text-cream/80 mt-7 leading-relaxed max-w-lg">
              Консьерж на базе Claude — помнит ваш эспрессо, предугадывает ужин, говорит на двенадцати языках в любое время.
            </p>
            <div className="flex flex-wrap gap-3 mt-8">
              <button className="bg-gradient-gold text-[var(--navy)] px-6 py-3 rounded-full text-sm font-medium flex items-center gap-2 hover:opacity-90 transition">
                Попробовать консьержа <ArrowRight className="h-4 w-4" />
              </button>
              <button className="border border-cream/30 text-cream px-6 py-3 rounded-full text-sm font-medium flex items-center gap-2 hover:bg-white/10 transition">
                <Play className="h-4 w-4" /> Смотреть фильм
              </button>
            </div>
            <div className="grid grid-cols-3 gap-4 mt-12 max-w-md">
              {[
                { v: "24/7", l: "Предвосхищающий AI" },
                { v: "12", l: "Языков свободно" },
                { v: "−40%", l: "Нагрузка на персонал" },
              ].map((s, i) => (
                <div key={i}>
                  <div className="font-display text-3xl text-[var(--gold)]">{s.v}</div>
                  <div className="text-[10px] uppercase tracking-wider text-cream/60 mt-1">{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right widget */}
        <div className="bg-[var(--cream)] p-4 lg:p-8 flex items-center justify-center">
          <div className="w-full max-w-md">
            <ConciergeWidget />
          </div>
        </div>
      </section>

      {/* Editorial principles */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 py-20">
        <div className="text-[10px] tracking-[0.3em] uppercase text-[var(--gold-deep)] text-center">Принципы</div>
        <h2 className="font-display italic text-4xl lg:text-5xl text-center mt-2 mb-3">Тихая роскошь, заметная всегда.</h2>
        <div className="gold-line w-32 mx-auto mb-12" />
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { n: "01", t: "Предвосхищение", d: "На базе Claude. Учится по визитам. Знает ваш кофе ещё до приезда." },
            { n: "02", t: "Многоязычность", d: "Двенадцать языков. Голосовое распознавание в реальном времени. Ничего не теряется в переводе." },
            { n: "03", t: "Автоматизация", d: "Уборка, ремонт, питание — мгновенно маршрутизируется правильной команде с фото-доказательствами." },
            { n: "04", t: "Деликатность", d: "Не нужно приложения. Встроен тихо в существующие точки контакта. Всегда доступен." },
          ].map(p => (
            <div key={p.n}>
              <div className="font-mono text-xs text-[var(--gold-deep)] mb-2">— {p.n}</div>
              <h3 className="font-display text-2xl mb-2">{p.t}</h3>
              <p className="text-sm text-[var(--navy)]/70 leading-relaxed">{p.d}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-[var(--line)] py-8 text-center text-xs text-[var(--navy)]/50">
        <div className="font-display italic">Azure Coastal Resort · Амальфи</div>
        <div className="mt-1 font-mono">© 2026 ЛЮКСОВАЯ КОЛЛЕКЦИЯ</div>
      </footer>
    </main>
  );
}
