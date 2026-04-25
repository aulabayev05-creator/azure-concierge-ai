import { useEffect, useState } from "react";
import { Heart, MapPin, Star } from "lucide-react";
import { EXPERIENCES, CATEGORIES } from "@/lib/guest";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";

export function PlacesTab() {
  const [cat, setCat] = useState("all");
  const [sort, setSort] = useState<"reco" | "near" | "rating">("reco");
  const [favs, setFavs] = useState<Set<number>>(new Set());

  useEffect(() => {
    supabase.from("favorites").select("place_id").then(({ data }) => {
      if (data) setFavs(new Set(data.map((f: any) => f.place_id)));
    });
  }, []);

  const toggleFav = async (id: number) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    if (favs.has(id)) {
      await supabase.from("favorites").delete().eq("user_id", user.id).eq("place_id", id);
      setFavs(p => { const n = new Set(p); n.delete(id); return n; });
    } else {
      await supabase.from("favorites").insert({ user_id: user.id, place_id: id });
      setFavs(p => new Set(p).add(id));
    }
  };

  const filtered = EXPERIENCES.filter(e => cat === "all" || e.cat === cat);
  const sorted = [...filtered].sort((a, b) => {
    if (sort === "rating") return b.rating - a.rating;
    if (sort === "near") return parseFloat(a.dist) - parseFloat(b.dist);
    return (b.personalized ? 1 : 0) - (a.personalized ? 1 : 0);
  });

  return (
    <div className="overflow-y-auto h-full">
      {/* Hero */}
      <div className="bg-gradient-navy text-cream p-5 relative overflow-hidden">
        <div className="text-[10px] tracking-[0.25em] uppercase text-[var(--gold)] mb-1">Амальфи · Откройте</div>
        <h2 className="font-display text-3xl italic leading-tight">Откройте свой город</h2>
        <p className="text-cream/70 text-sm mt-2 max-w-md">Девять подобранных мест в шаговой доступности от Meken AI — от мишленовских столов до тропы вдоль скал.</p>
        {/* Mini SVG map */}
        <svg className="absolute right-0 top-0 h-full w-1/2 opacity-30" viewBox="0 0 200 150">
          <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#C9A84C" strokeWidth="0.3" />
            </pattern>
          </defs>
          <rect width="200" height="150" fill="url(#grid)" />
          {[[40,40],[90,55],[130,80],[60,90],[150,40],[110,110]].map(([x,y], i) => (
            <g key={i} transform={`translate(${x},${y}) rotate(-45)`}>
              <circle r="4" fill="#C9A84C" />
              <circle r="2" fill="#0D1B37" />
            </g>
          ))}
        </svg>
      </div>

      {/* Filters */}
      <div className="px-4 py-3 flex flex-wrap items-center gap-2 border-b border-[var(--line)] bg-white sticky top-0 z-10">
        <div className="flex gap-1.5 overflow-x-auto edge-fade flex-1">
          {CATEGORIES.map(c => (
            <button key={c.key} onClick={() => setCat(c.key)}
              className={`shrink-0 px-3 py-1 rounded-full text-xs border transition ${cat === c.key ? "bg-[var(--navy)] text-cream border-[var(--navy)]" : "border-[var(--line)] text-[var(--navy)] hover:border-[var(--gold)]"}`}>
              {c.label}
            </button>
          ))}
        </div>
        <select value={sort} onChange={(e) => setSort(e.target.value as any)} className="text-xs border border-[var(--line)] rounded-full px-2.5 py-1 bg-white font-mono">
          <option value="reco">Рекомендуемое</option>
          <option value="near">Ближайшее</option>
          <option value="rating">По рейтингу</option>
        </select>
      </div>

      {/* Cards */}
      <div className="p-4 grid sm:grid-cols-2 gap-3">
        {sorted.map(e => (
          <div key={e.id} className="rounded-xl overflow-hidden border border-[var(--line)] bg-white shadow-soft hover:shadow-elegant transition group">
            <div className="relative">
              <img src={e.img} alt={e.name} className="h-36 w-full object-cover" loading="lazy" />
              <div className="absolute top-2 left-2 flex flex-wrap gap-1">
                {e.personalized && <Badge className="bg-gradient-gold text-[var(--navy)] border-0 text-[10px]">✨ ДЛЯ ВАС</Badge>}
                {e.badge && <Badge className="bg-[var(--navy)] text-cream border-0 text-[10px]">{e.badge}</Badge>}
              </div>
              <button onClick={() => toggleFav(e.id)} className="absolute top-2 right-2 h-8 w-8 rounded-full bg-white/90 hover:bg-white flex items-center justify-center backdrop-blur">
                <Heart className={`h-4 w-4 ${favs.has(e.id) ? "fill-red-500 text-red-500" : "text-[var(--navy)]"}`} />
              </button>
              <div className="absolute bottom-2 left-2">
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${e.openNow ? "bg-emerald-500/90 text-white" : "bg-red-500/90 text-white"}`}>
                  {e.openNow ? "Открыто" : "Закрыто"}
                </span>
              </div>
            </div>
            <div className="p-3">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="font-display text-base text-[var(--navy)] truncate">{e.name}</div>
                  <div className="text-[11px] text-[var(--navy)]/60">{e.tag}</div>
                </div>
                <div className="text-right shrink-0">
                  <div className="flex items-center gap-0.5 text-xs"><Star className="h-3 w-3 fill-[var(--gold)] text-[var(--gold)]" /><span className="font-mono">{e.rating}</span></div>
                  <div className="text-[10px] text-[var(--navy)]/50 font-mono">{e.reviews} отзывов</div>
                </div>
              </div>
              <p className="text-xs text-[var(--navy)]/70 mt-2 line-clamp-2 leading-relaxed">{e.desc}</p>
              <div className="flex items-center justify-between mt-3 text-[11px] text-[var(--navy)]/60 font-mono">
                <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{e.mins}</span>
                <span>{e.price}</span>
              </div>
              <button className="w-full mt-2.5 bg-[var(--navy)] text-cream rounded-lg py-1.5 text-xs font-medium hover:opacity-90">Посмотреть / Забронировать</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
