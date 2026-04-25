import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import { ConciergeChat } from "@/components/concierge/ConciergeChat";
import { TopNav } from "@/components/TopNav";

export const Route = createFileRoute("/ai-chat")({
  component: () => (
    <AuthProvider>
      <AiChatPage />
    </AuthProvider>
  ),
});

function AiChatPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [view, setView] = useState<"guest" | "ops">("guest");

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth" });
  }, [user, loading, navigate]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--cream)]">
        <div className="font-display italic text-[var(--navy)]/60">Подождите…</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--cream)]">
      <TopNav
        view={view}
        setView={setView}
        onViewSwitch={(nextView) => {
          navigate({ to: "/", hash: nextView });
        }}
      />
      <main className="pt-16 h-[calc(100dvh-4rem)] overflow-hidden">
        <ConciergeChat onRequestCreated={() => {}} standalone />
      </main>
    </div>
  );
}
