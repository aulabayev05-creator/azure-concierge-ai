import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  component: () => (
    <AuthProvider>
      <AuthPage />
    </AuthProvider>
  ),
});

function AuthPage() {
  const { user, signIn, loading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => { if (user && !loading) navigate({ to: "/" }); }, [user, loading, navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const { error } = await signIn(email, password);
    setBusy(false);
    if (error) toast.error(error);
  };

  return (
    <div className="min-h-screen bg-gradient-navy flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-elegant p-8">
        <div className="text-[10px] tracking-[0.3em] uppercase text-[var(--gold-deep)] text-center">ЛЮКСОВАЯ КОЛЛЕКЦИЯ</div>
        <h1 className="font-display text-3xl italic text-center mt-1 mb-6">Meken AI</h1>
        <form onSubmit={submit} className="space-y-3">
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email"
            className="w-full border border-[var(--line)] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[var(--gold)]" />
          <input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Пароль (мин. 6 символов)"
            className="w-full border border-[var(--line)] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[var(--gold)]" />
          <button type="submit" disabled={busy} className="w-full bg-gradient-gold text-[var(--navy)] rounded-lg py-2.5 text-sm font-medium hover:opacity-90 disabled:opacity-50">
            {busy ? "Подождите…" : "Войти"}
          </button>
        </form>
        <p className="text-xs text-center text-[var(--navy)]/50 mt-5 italic">Демо-гость: г-н Маркус Чен · Номер 402</p>
      </div>
    </div>
  );
}
