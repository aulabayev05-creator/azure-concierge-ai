import { useEffect, useState } from "react";
import { Check, Star } from "lucide-react";
import { toast } from "sonner";
import { REQUEST_LABELS } from "@/lib/guest";

const STAGES = ["received", "assigned", "in_progress", "done"] as const;
type Stage = typeof STAGES[number];

const STAGE_LABEL: Record<Stage, string> = {
  received: "Принято",
  assigned: "Назначено",
  in_progress: "Выполняется",
  done: "Завершено",
};

export function RequestTracker({
  type, id, photoUrl, onRated,
}: { type: string; id: string; photoUrl?: string; onRated?: (v: number) => void }) {
  const [stage, setStage] = useState<Stage>("received");
  const [rating, setRating] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => { setStage("assigned"); toast.message(`Заявка #${id} назначена`); }, 2200);
    const t2 = setTimeout(() => { setStage("in_progress"); toast.message(`#${id} в работе`, { description: `${REQUEST_LABELS[type] ?? type} уже в пути` }); }, 4800);
    const t3 = setTimeout(() => { setStage("done"); toast.success(`#${id} завершено`, { description: "Оцените, пожалуйста" }); }, 9500);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [id, type]);

  const idx = STAGES.indexOf(stage);
  const pct = ((idx + 1) / STAGES.length) * 100;

  return (
    <div className="rounded-xl border border-[var(--line)] bg-white p-3.5 mt-2 shadow-soft">
      <div className="flex items-center justify-between mb-2">
        <div>
          <div className="text-[10px] uppercase tracking-[0.18em] text-[var(--navy)]/50 font-mono">Заявка #{id}</div>
          <div className="font-display text-base">{REQUEST_LABELS[type] ?? type}</div>
        </div>
        <div className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${stage === "done" ? "bg-emerald-100 text-emerald-700" : "bg-[var(--gold-soft)] text-[var(--gold-deep)]"}`}>
          {STAGE_LABEL[stage]}
        </div>
      </div>
      <div className="h-1.5 bg-[var(--line)] rounded-full overflow-hidden">
        <div className="h-full bg-gradient-gold transition-all duration-700 ease-elegant" style={{ width: `${pct}%` }} />
      </div>
      <div className="flex justify-between mt-2 text-[10px] font-mono text-[var(--navy)]/60">
        {STAGES.map((s, i) => (
          <span key={s} className={i <= idx ? "text-[var(--navy)]" : ""}>
            {i <= idx && <Check className="inline h-2.5 w-2.5 mr-0.5 text-[var(--gold-deep)]" />}
            {STAGE_LABEL[s]}
          </span>
        ))}
      </div>
      {photoUrl && (
        <img src={photoUrl} alt="фото заявки" className="mt-3 rounded-lg max-h-32 w-full object-cover border border-[var(--line)]" />
      )}
      {stage === "done" && (
        <div className="mt-3 flex items-center justify-center gap-1">
          {[1,2,3,4,5].map(n => (
            <button key={n} onClick={() => { setRating(n); onRated?.(n); toast.success("Отзыв получен", { description: `Спасибо — оценка ${n}/5` }); }}>
              <Star className={`h-5 w-5 transition ${n <= rating ? "fill-[var(--gold)] text-[var(--gold)]" : "text-[var(--line)]"}`} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
