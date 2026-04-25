import { Bar, BarChart, Area, AreaChart, Line, LineChart, Pie, PieChart, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Download, Plus, Activity } from "lucide-react";

const REQUESTS_7D = [
  { d: "Пн", v: 38 }, { d: "Вт", v: 42 }, { d: "Ср", v: 35 }, { d: "Чт", v: 49 },
  { d: "Пт", v: 56 }, { d: "Сб", v: 61 }, { d: "Сегодня", v: 47, today: true },
];
const HOURLY = Array.from({ length: 12 }, (_, i) => ({ h: `${i * 2}:00`.padStart(5, "0"), load: Math.round(20 + 50 * Math.sin(i / 2) + Math.random() * 10) }));
const REV_SAT = [
  { d: "Пн", rev: 12400, sat: 4.6 }, { d: "Вт", rev: 14200, sat: 4.7 }, { d: "Ср", rev: 11800, sat: 4.8 },
  { d: "Чт", rev: 15900, sat: 4.7 }, { d: "Пт", rev: 18200, sat: 4.9 }, { d: "Сб", rev: 21500, sat: 4.9 }, { d: "Вс", rev: 19800, sat: 4.8 },
];
const CATS = [
  { name: "Питание", v: 32 }, { name: "Уборка", v: 24 }, { name: "Спа", v: 15 },
  { name: "Ремонт", v: 8 }, { name: "Транспорт", v: 12 }, { name: "Прочее", v: 9 },
];
const PIE_COLORS = ["#C9A84C", "#0D1B37", "#1d3060", "#9c8538", "#3a8a5a", "#a9a9a9"];

const QUEUE = [
  { id: "#1844", title: "Уборка · Номер 312", meta: "14 мин назад", status: "progress", staff: "Елена М." },
  { id: "#1845", title: "Рум-сервис · Номер 508", meta: "8 мин назад", status: "pending", staff: "Не назначен" },
  { id: "#1846", title: "Такси · Номер 201", meta: "Подача через 10 мин", status: "progress", staff: "Марко Р." },
  { id: "#1842", title: "Ремонт · Номер 418", meta: "34 мин назад", status: "progress", staff: "Антонио С." },
  { id: "#1841", title: "Бронь спа · Номер 622", meta: "45 мин назад", status: "done", staff: "София Л." },
  { id: "#1840", title: "Полотенца · Номер 304", meta: "1 ч назад", status: "done", staff: "Мария К." },
];

const STAFF = [
  { team: "Уборка", load: 72, n: 8 }, { team: "Кухня", load: 85, n: 12 },
  { team: "Инженерия", load: 45, n: 4 }, { team: "Ресепшен", load: 60, n: 3 },
  { team: "Спа", load: 90, n: 6 },
];

const FEED = [
  { time: "сейчас", text: "София Л. завершила бронь спа · #1841" },
  { time: "2 мин", text: "Создана заявка #1846 — Такси, Номер 201" },
  { time: "5 мин", text: "Антонио С. прибыл в Номер 418" },
  { time: "8 мин", text: "Г-н Чен оценил заявку 5/5" },
  { time: "12 мин", text: "Marco Rossi подтвердил подачу машины" },
];

function loadColor(p: number) {
  if (p < 60) return "bg-emerald-500";
  if (p < 80) return "bg-[var(--gold)]";
  return "bg-red-500";
}

const stColor = { pending: "border-l-amber-400", progress: "border-l-[var(--gold)]", done: "border-l-emerald-500" } as const;

export function OperationsView() {
  return (
    <div className="min-h-screen bg-[var(--cream)] pt-24 pb-12 px-4 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between flex-wrap gap-3 mb-6">
          <div>
            <div className="text-[10px] uppercase tracking-[0.25em] text-[var(--gold-deep)]">Azure · Операции</div>
            <h1 className="font-display text-4xl italic mt-1">Маршрутизация в реальном времени</h1>
            <div className="flex items-center gap-2 mt-2 text-xs text-[var(--navy)]/60">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-live-dot" /> В эфире · София Риччи · Менеджер ресепшена · На смене
            </div>
          </div>
          <div className="flex gap-2">
            <button className="px-3 py-2 border border-[var(--line)] rounded-lg text-sm flex items-center gap-1.5 bg-white"><Download className="h-3.5 w-3.5" /> Экспорт</button>
            <button className="px-3 py-2 bg-[var(--navy)] text-cream rounded-lg text-sm flex items-center gap-1.5"><Plus className="h-3.5 w-3.5" /> Создать заявку</button>
          </div>
        </div>

        {/* KPI */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          {[
            { ico: "📋", v: 47, l: "Заявок сегодня", d: "+12% ↑", up: true },
            { ico: "⚡", v: 6, l: "В работе", d: "+5% ↑", up: true },
            { ico: "⏱️", v: "8м", l: "Среднее время отклика", d: "−23% ↓", up: false },
            { ico: "⭐", v: 4.9, l: "Удовлетворённость", d: "+0.3 ↑", up: true },
          ].map((k, i) => (
            <div key={i} className="bg-white border border-[var(--line)] rounded-xl p-4 shadow-soft">
              <div className="text-2xl">{k.ico}</div>
              <div className="font-display text-3xl mt-1">{k.v}</div>
              <div className="text-[11px] text-[var(--navy)]/60 mt-0.5">{k.l}</div>
              <div className={`text-[10px] font-mono mt-1 ${k.up ? "text-emerald-600" : "text-emerald-600"}`}>{k.d}</div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-[3fr_2fr] gap-4 mb-6">
          {/* Queue */}
          <div className="bg-white border border-[var(--line)] rounded-xl p-4 shadow-soft">
            <div className="font-display text-lg mb-3">Live-очередь</div>
            <div className="space-y-2">
              {QUEUE.map(q => (
                <div key={q.id} className={`border-l-4 ${stColor[q.status as keyof typeof stColor]} bg-[var(--cream)]/50 rounded-r-lg p-2.5 flex items-center justify-between`}>
                  <div>
                    <div className="text-[10px] font-mono text-[var(--navy)]/50">{q.id}</div>
                    <div className="text-sm font-medium">{q.title}</div>
                    <div className="text-[11px] text-[var(--navy)]/60">{q.meta} · {q.staff}</div>
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--navy)]/60">{q.status === "pending" ? "Ожидание" : q.status === "progress" ? "В работе" : "Готово"}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Staff load */}
          <div className="space-y-4">
            <div className="bg-white border border-[var(--line)] rounded-xl p-4 shadow-soft">
              <div className="font-display text-lg mb-3">Загрузка персонала</div>
              <div className="space-y-3">
                {STAFF.map(s => (
                  <div key={s.team}>
                    <div className="flex justify-between text-xs mb-1"><span>{s.team} <span className="text-[var(--navy)]/50 font-mono">({s.n})</span></span><span className="font-mono">{s.load}%</span></div>
                    <div className="h-2 bg-[var(--line)] rounded-full overflow-hidden">
                      <div className={`h-full ${loadColor(s.load)}`} style={{ width: `${s.load}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white border border-[var(--line)] rounded-xl p-4 shadow-soft">
              <div className="font-display text-lg mb-2 flex items-center gap-2"><Activity className="h-4 w-4 text-[var(--gold)]" /> Лента активности</div>
              <div className="space-y-2 text-xs">
                {FEED.map((f, i) => (
                  <div key={i} className="flex gap-3"><span className="font-mono text-[var(--navy)]/50 w-12 shrink-0">{f.time}</span><span>{f.text}</span></div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-4">
          <ChartCard title="Заявки за 7 дней">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={REQUESTS_7D}><CartesianGrid strokeDasharray="3 3" stroke="#e8e2d3" /><XAxis dataKey="d" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip />
                <Bar dataKey="v" radius={[6, 6, 0, 0]}>
                  {REQUESTS_7D.map((e, i) => <Cell key={i} fill={e.today ? "#9c8538" : "#C9A84C"} />)}
                </Bar></BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Нагрузка по часам">
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={HOURLY}><defs><linearGradient id="ld" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#C9A84C" stopOpacity={0.6} /><stop offset="100%" stopColor="#C9A84C" stopOpacity={0} /></linearGradient></defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e8e2d3" /><XAxis dataKey="h" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip />
                <Area type="monotone" dataKey="load" stroke="#C9A84C" strokeWidth={2} fill="url(#ld)" /></AreaChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Выручка и удовлетворённость">
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={REV_SAT}><CartesianGrid strokeDasharray="3 3" stroke="#e8e2d3" /><XAxis dataKey="d" tick={{ fontSize: 11 }} /><YAxis yAxisId="l" tick={{ fontSize: 10 }} /><YAxis yAxisId="r" orientation="right" domain={[4, 5]} tick={{ fontSize: 10 }} /><Tooltip /><Legend wrapperStyle={{ fontSize: 11 }} />
                <Line yAxisId="l" type="monotone" dataKey="rev" stroke="#0D1B37" strokeWidth={2} name="Выручка $" />
                <Line yAxisId="r" type="monotone" dataKey="sat" stroke="#C9A84C" strokeWidth={2} name="Оценка" /></LineChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Категории заявок">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart><Pie data={CATS} dataKey="v" nameKey="name" innerRadius={45} outerRadius={75} paddingAngle={2}>
                {CATS.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
              </Pie><Tooltip /><Legend wrapperStyle={{ fontSize: 11 }} /></PieChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </div>
    </div>
  );
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-[var(--line)] rounded-xl p-4 shadow-soft">
      <div className="font-display text-base mb-2">{title}</div>
      {children}
    </div>
  );
}
