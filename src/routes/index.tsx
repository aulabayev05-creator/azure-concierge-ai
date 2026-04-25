import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import { TopNav } from "@/components/TopNav";
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
  useEffect(() => {
    if (typeof window === "undefined") return;
    const hash = window.location.hash.replace("#", "");
    if (hash === "guest" || hash === "ops") setView(hash);
  }, []);

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
      <section className="min-h-[calc(100vh-4rem)] bg-gradient-navy text-cream p-8 lg:p-14 relative overflow-hidden">
        <div className="absolute -top-20 right-0 h-80 w-80 rounded-full bg-gradient-gold opacity-15 blur-3xl" />
        <div className="absolute bottom-[-4rem] left-10 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="relative max-w-7xl mx-auto grid lg:grid-cols-[1.1fr_0.9fr] gap-10 items-center">
          <div className="max-w-xl">
            <div className="text-[10px] tracking-[0.35em] uppercase text-[var(--gold)] mb-6">Том IV · Весна 2026</div>
            <h1 className="font-display italic text-5xl md:text-6xl lg:text-[76px] leading-[0.95] text-balance">
              Искусство невысказанной просьбы.
            </h1>
            <p className="font-display italic text-xl md:text-[22px] text-cream/80 mt-7 leading-relaxed max-w-lg">
              Meken AI предугадывает желания гостей, автоматизирует сервис и оставляет команде только самое важное: личное внимание.
            </p>
            <div className="flex flex-wrap gap-3 mt-8">
              <a href="/ai-chat" className="bg-gradient-gold text-[var(--navy)] px-6 py-3 rounded-full text-sm font-medium inline-flex items-center gap-2 hover:opacity-90 transition">
                Перейти в AI-чат <ArrowRight className="h-4 w-4" />
              </a>
              <button className="border border-cream/30 text-cream px-6 py-3 rounded-full text-sm font-medium flex items-center gap-2 hover:bg-white/10 transition">
                <Play className="h-4 w-4" /> Смотреть демо
              </button>
            </div>
            <div className="grid grid-cols-3 gap-4 mt-12 max-w-md">
              {[
                { v: "24/7", l: "Доступность сервиса" },
                { v: "12", l: "Языков общения" },
                { v: "−40%", l: "Рутинных запросов" },
              ].map((s, i) => (
                <div key={i}>
                  <div className="font-display text-3xl text-[var(--gold)]">{s.v}</div>
                  <div className="text-[10px] uppercase tracking-wider text-cream/60 mt-1">{s.l}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-3xl border border-white/20 bg-white/10 backdrop-blur-sm p-6 lg:p-8">
            <div className="flex items-center justify-between border-b border-white/20 pb-4">
              <div>
                <div className="font-display text-xl">Service Snapshot</div>
                <div className="text-xs tracking-wider uppercase text-cream/60 mt-1">Режим реального времени</div>
              </div>
              <span className="text-[10px] px-3 py-1 rounded-full bg-[var(--gold)] text-[var(--navy)] font-medium">Live</span>
            </div>
            <div className="space-y-4 mt-5">
              {[
                { t: "Check-in запросы", v: "92% закрыто < 2 мин" },
                { t: "Room service", v: "Среднее ожидание 8 мин" },
                { t: "Guest sentiment", v: "4.9/5 за последние 24ч" },
              ].map(item => (
                <div key={item.t} className="rounded-2xl bg-white/10 border border-white/15 px-4 py-3">
                  <div className="text-xs uppercase tracking-wider text-cream/60">{item.t}</div>
                  <div className="font-display text-2xl mt-1">{item.v}</div>
                </div>
              ))}
            </div>
            <div className="mt-5 text-sm text-cream/80 leading-relaxed">
              Панель показывает стабильность сервиса без отвлечения гостей: чат-виджет вынесен в отдельный раздел для персонала.
            </div>
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
            { n: "01", t: "Предвосхищение", d: "На базе ChatGPT. Учится по визитам. Знает ваш кофе ещё до приезда." },
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

      {/* Use cases */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 pb-20">
        <div className="rounded-3xl border border-[var(--line)] bg-white/70 p-8 lg:p-12">
          <div className="text-[10px] tracking-[0.3em] uppercase text-[var(--gold-deep)]">Сценарии</div>
          <h2 className="font-display italic text-3xl lg:text-4xl mt-2 mb-8">Где система приносит максимум эффекта</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: "До заезда", text: "Подготовка номера, трансфер и особые пожелания гостя фиксируются заранее в одной цепочке." },
              { title: "Во время проживания", text: "Запросы из номера, ресторана и SPA объединяются и сразу уходят ответственным командам." },
              { title: "После выезда", text: "Сигналы удовлетворенности и паттерны запросов формируют персонализацию следующего визита." },
            ].map(item => (
              <div key={item.title} className="rounded-2xl border border-[var(--line)] bg-[var(--cream)] p-5">
                <h3 className="font-display text-2xl">{item.title}</h3>
                <p className="text-sm text-[var(--navy)]/75 mt-2 leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="/ai-chat" className="bg-[var(--navy)] text-cream px-6 py-3 rounded-full text-sm font-medium inline-flex items-center gap-2 hover:opacity-90 transition">
              Открыть рабочий чат <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      <footer className="border-t border-[var(--line)] py-8 text-center text-xs text-[var(--navy)]/50">
        <div className="font-display italic">Meken AI Coastal Resort · Амальфи</div>
        <div className="mt-1 font-mono">© 2026 ЛЮКСОВАЯ КОЛЛЕКЦИЯ</div>
      </footer>
    </main>
  );
}
