import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/hooks/useAuth";
import { LogOut, ShoppingBag } from "lucide-react";

export function TopNav({
  view,
  setView,
  onViewSwitch,
}: {
  view: "guest" | "ops";
  setView: (v: "guest" | "ops") => void;
  onViewSwitch?: (v: "guest" | "ops") => void;
}) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 inset-x-0 z-40 backdrop-blur-md bg-[var(--cream)]/85 border-b border-[var(--line)]">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <button onClick={() => navigate({ to: "/" })} className="text-left hover:opacity-85 transition">
            <div className="text-[9px] tracking-[0.3em] uppercase text-[var(--gold-deep)]">ЛЮКСОВАЯ КОЛЛЕКЦИЯ</div>
            <div className="font-display text-lg italic leading-none">Meken AI</div>
          </button>
          <nav className="hidden lg:flex gap-5 text-xs uppercase tracking-wider text-[var(--navy)]/70">
            <button onClick={() => navigate({ to: "/ai-chat" })} className="hover:text-[var(--gold-deep)] transition">AI чат</button>
            {["Сьюты", "Кухня", "Спа", "Впечатления", "События", "Журнал"].map(l => (
              <a key={l} href="#" className="hover:text-[var(--gold-deep)] transition">{l}</a>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex bg-white border border-[var(--line)] rounded-full p-0.5 text-xs">
            <button onClick={() => { setView("guest"); onViewSwitch?.("guest"); }} className={`px-3 py-1 rounded-full transition ${view === "guest" ? "bg-[var(--navy)] text-cream" : ""}`}>Гость</button>
            <button onClick={() => { setView("ops"); onViewSwitch?.("ops"); }} className={`px-3 py-1 rounded-full transition ${view === "ops" ? "bg-[var(--navy)] text-cream" : ""}`}>Операции</button>
          </div>
          <button className="relative h-9 w-9 rounded-full hover:bg-white border border-transparent hover:border-[var(--line)] flex items-center justify-center">
            <ShoppingBag className="h-4 w-4" />
            <span className="absolute -top-1 -right-1 h-4 w-4 bg-[var(--gold)] text-[var(--navy)] text-[9px] font-mono rounded-full flex items-center justify-center">2</span>
          </button>
          {user ? (
            <button onClick={async () => { await signOut(); navigate({ to: "/auth" }); }} className="h-9 w-9 rounded-full bg-[var(--navy)] text-cream flex items-center justify-center" title="Выход">
              <LogOut className="h-4 w-4" />
            </button>
          ) : (
            <button onClick={() => navigate({ to: "/auth" })} className="text-xs px-3 py-1.5 bg-gradient-gold text-[var(--navy)] rounded-full font-medium">Войти</button>
          )}
        </div>
      </div>
    </header>
  );
}
