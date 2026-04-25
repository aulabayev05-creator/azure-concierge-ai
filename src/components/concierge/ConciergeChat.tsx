import { useState, useRef, useEffect } from "react";
import { Mic, Send, Plus, Image as ImageIcon, MapPin, User, CreditCard, Calendar, X } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { detectIntent, type Intent } from "@/lib/intent";
import { QUICK_ACTIONS, REQUEST_LABELS } from "@/lib/guest";
import { WidgetHeader, GuestStrip, PersonalBanner, MessageBubble, TypingIndicator } from "./ChatPrimitives";
import { DiningCard, SpaCard, ReservationCard, WeatherCard, ItineraryCard, PaymentCard, RecosCard } from "./ChatCards";
import { RequestTracker } from "./RequestTracker";

interface Msg {
  id: string;
  role: "user" | "ai" | "staff";
  content: string;
  time: string;
  attach?: { type: string; data?: any };
  photoUrl?: string;
}

const SAMPLES_RU = [
  "Забронируй стол на ужин сегодня",
  "Принесите свежие полотенца, пожалуйста",
  "Какая погода сегодня?",
  "Поставь будильник на 7 утра",
  "Посоветуй что-нибудь итальянское на вечер",
];

const now = () => new Date().toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });

export function ConciergeChat({ onRequestCreated }: { onRequestCreated: (id: string, type: string, photoUrl?: string) => void }) {
  const [messages, setMessages] = useState<Msg[]>([
    { id: "welcome", role: "ai", time: now(), content: "Добрый день. Чем могу быть полезен — ужин, спа, прогулка или что-то по номеру?" },
  ]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [language, setLanguage] = useState("RU");
  const [voiceOpen, setVoiceOpen] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [pendingPhoto, setPendingPhoto] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const recRef = useRef<any>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, streaming]);

  const attachIntent = async (intent: Intent, userText: string) => {
    if (!intent) return;
    const id = `${1840 + Math.floor(Math.random() * 100)}`;
    if (intent.type === "request") {
      let photoUrl: string | undefined;
      if (pendingPhoto) {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const path = `${user.id}/${Date.now()}-${pendingPhoto.name}`;
          const { error } = await supabase.storage.from("request-photos").upload(path, pendingPhoto);
          if (!error) {
            const { data } = await supabase.storage.from("request-photos").createSignedUrl(path, 3600);
            photoUrl = data?.signedUrl;
          }
          setPendingPhoto(null);
        }
      }
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from("requests").insert({
          user_id: user.id, type: intent.key, stage: "received", room: "402", photo_url: photoUrl,
        });
      }
      toast.success(`Заявка #${id} создана`, { description: `Назначено: ${REQUEST_LABELS[intent.key] ?? intent.key}` });
      setMessages(m => [...m, { id: `t-${id}`, role: "ai", time: now(), content: "", attach: { type: "tracker", data: { trackerType: intent.key, trackerId: id, photoUrl } }, photoUrl }]);
      onRequestCreated(id, intent.key, photoUrl);
    } else if (intent.type === "serviceCard") {
      setMessages(m => [...m, { id: `c-${Date.now()}`, role: "ai", time: now(), content: "", attach: { type: intent.cat } }]);
    } else if (intent.type === "reservation") {
      setMessages(m => [...m, { id: `r-${Date.now()}`, role: "ai", time: now(), content: "", attach: { type: "reservation", data: { kind: intent.kind } } }]);
    } else if (intent.type === "weather") {
      setMessages(m => [...m, { id: `w-${Date.now()}`, role: "ai", time: now(), content: "", attach: { type: "weather" } }]);
    } else if (intent.type === "itinerary") {
      setMessages(m => [...m, { id: `i-${Date.now()}`, role: "ai", time: now(), content: "", attach: { type: "itinerary" } }]);
    } else if (intent.type === "recos") {
      setMessages(m => [...m, { id: `rc-${Date.now()}`, role: "ai", time: now(), content: "", attach: { type: "recos" } }]);
    } else if (intent.type === "payment") {
      setMessages(m => [...m, { id: `p-${Date.now()}`, role: "ai", time: now(), content: "", attach: { type: "payment" } }]);
    } else if (intent.type === "staff") {
      setTimeout(() => {
        toast.message("Соединение со специалистом…", { description: "София · Менеджер ресепшена" });
        setMessages(m => [...m, { id: `s-${Date.now()}`, role: "staff", time: now(), content: "Здравствуйте, г-н Чен! Чем могу помочь лично?" }]);
      }, 800);
    }
  };

  const sendMessage = async (text: string) => {
    if (!text.trim() || streaming) return;
    const userMsg: Msg = { id: `u-${Date.now()}`, role: "user", time: now(), content: text };
    setMessages(m => [...m, userMsg]);
    setInput("");
    setStreaming(true);

    const aiId = `a-${Date.now()}`;
    setMessages(m => [...m, { id: aiId, role: "ai", time: now(), content: "" }]);

    try {
      const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/concierge-chat`;
      const resp = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}` },
        body: JSON.stringify({
          messages: [...messages.filter(m => m.role !== "staff").map(m => ({ role: m.role === "ai" ? "assistant" : "user", content: m.content })),
                     { role: "user", content: text }],
        }),
      });
      if (!resp.ok || !resp.body) {
        if (resp.status === 429) toast.error("Превышен лимит запросов", { description: "Попробуйте через минуту" });
        else if (resp.status === 402) toast.error("AI кредиты закончились", { description: "Пополните баланс в настройках" });
        else toast.error("Ошибка консьержа");
        setStreaming(false);
        return;
      }
      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buf = "";
      let assembled = "";
      let done = false;
      while (!done) {
        const { done: d, value } = await reader.read();
        if (d) break;
        buf += decoder.decode(value, { stream: true });
        let nl: number;
        while ((nl = buf.indexOf("\n")) !== -1) {
          let line = buf.slice(0, nl);
          buf = buf.slice(nl + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (!line.startsWith("data: ")) continue;
          const json = line.slice(6).trim();
          if (json === "[DONE]") { done = true; break; }
          try {
            const parsed = JSON.parse(json);
            const c = parsed.choices?.[0]?.delta?.content;
            if (c) {
              assembled += c;
              setMessages(prev => prev.map(m => m.id === aiId ? { ...m, content: assembled } : m));
            }
          } catch { buf = line + "\n" + buf; break; }
        }
      }
      const intent = detectIntent(text);
      if (intent) await attachIntent(intent, text);
    } catch (e) {
      console.error(e);
      toast.error("Не удалось связаться с консьержем");
    } finally {
      setStreaming(false);
    }
  };

  const startVoice = () => {
    const SR = (typeof window !== "undefined" && ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition));
    if (!SR) {
      toast.warning("Голос недоступен", { description: "Используйте Chrome или Edge" });
      const sample = SAMPLES_RU[Math.floor(Math.random() * SAMPLES_RU.length)];
      setVoiceOpen(true); setTranscript("");
      let i = 0;
      const tick = setInterval(() => { setTranscript(sample.slice(0, ++i)); if (i >= sample.length) { clearInterval(tick); setTimeout(() => { setVoiceOpen(false); sendMessage(sample); }, 600); } }, 50);
      return;
    }
    const rec = new SR(); rec.lang = "ru-RU"; rec.interimResults = true; rec.continuous = false;
    rec.onresult = (e: any) => {
      let interim = "", final = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) final += e.results[i][0].transcript;
        else interim += e.results[i][0].transcript;
      }
      setTranscript(final + interim);
    };
    rec.onend = () => { setVoiceOpen(false); if (transcript.trim()) sendMessage(transcript); };
    rec.start();
    recRef.current = rec;
    setVoiceOpen(true); setTranscript("");
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault(); setDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f && f.type.startsWith("image/")) setPendingPhoto(f);
  };

  const renderAttach = (m: Msg) => {
    if (!m.attach) return null;
    if (m.attach.type === "tracker") {
      return <RequestTracker type={m.attach.data.trackerType} id={m.attach.data.trackerId} photoUrl={m.attach.data.photoUrl} />;
    }
    if (m.attach.type === "dining") return <DiningCard onConfirm={() => {}} />;
    if (m.attach.type === "spa") return <SpaCard onConfirm={() => {}} />;
    if (m.attach.type === "reservation") return <ReservationCard />;
    if (m.attach.type === "weather") return <WeatherCard />;
    if (m.attach.type === "itinerary") return <ItineraryCard />;
    if (m.attach.type === "recos") return <RecosCard />;
    if (m.attach.type === "payment") return <PaymentCard />;
    return null;
  };

  return (
    <div className="flex flex-col h-full bg-[var(--cream)]">
      <WidgetHeader language={language} setLanguage={setLanguage} />
      <GuestStrip />
      <PersonalBanner onOption={(a) => {
        if (a === "spa") attachIntent({ type: "request", key: "spa" } as any, "Забронировать спа в 16:00");
        if (a === "recos") attachIntent({ type: "recos" }, "Покажи варианты");
      }} />

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-3 min-h-0">
        {messages.map(m => (
          <div key={m.id}>
            <MessageBubble role={m.role} content={m.content || (m.role === "ai" && streaming && m.id.startsWith("a-") ? <TypingIndicator /> : "")} time={m.content ? m.time : undefined} />
            {renderAttach(m)}
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="border-t border-[var(--line)] bg-white/60">
        <div className="flex gap-1.5 overflow-x-auto px-3 py-2 edge-fade">
          {QUICK_ACTIONS.map(a => (
            <button key={a.key} onClick={() => sendMessage(`Хочу ${a.label.toLowerCase()}`)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs border transition flex items-center gap-1.5 ${a.highlight ? "bg-[var(--gold-soft)] border-[var(--gold)]/40 text-[var(--navy)]" : "bg-white border-[var(--line)] text-[var(--navy)] hover:border-[var(--gold)]"}`}>
              <span>{a.ico}</span>{a.label}
            </button>
          ))}
        </div>
      </div>

      {/* Composer */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        className={`border-t border-[var(--line)] bg-white p-3 transition ${dragOver ? "ring-2 ring-[var(--gold)] ring-inset bg-[var(--gold-soft)]" : ""}`}
      >
        {pendingPhoto && (
          <div className="mb-2 flex items-center gap-2 bg-[var(--gold-soft)] border border-[var(--gold)]/30 rounded-lg p-1.5">
            <img src={URL.createObjectURL(pendingPhoto)} alt="" className="h-10 w-10 rounded object-cover" />
            <span className="text-xs flex-1 truncate">{pendingPhoto.name}</span>
            <button onClick={() => setPendingPhoto(null)} className="h-6 w-6 rounded-full hover:bg-white/60 flex items-center justify-center"><X className="h-3 w-3" /></button>
          </div>
        )}
        <div className="flex items-end gap-2 relative">
          <button onClick={() => setPopoverOpen(v => !v)} className="h-9 w-9 rounded-full border border-[var(--line)] hover:bg-[var(--gold-soft)] flex items-center justify-center shrink-0">
            <Plus className={`h-4 w-4 transition ${popoverOpen ? "rotate-45" : ""}`} />
          </button>
          {popoverOpen && (
            <div className="absolute bottom-12 left-0 bg-white border border-[var(--line)] rounded-xl shadow-elegant p-1.5 z-10 w-44">
              {[
                { ico: <ImageIcon className="h-3.5 w-3.5" />, label: "Фото", action: () => { document.getElementById("ph-input")?.click(); setPopoverOpen(false); } },
                { ico: <MapPin className="h-3.5 w-3.5" />, label: "Локация", action: () => { sendMessage("Поделиться локацией: Амальфи, отель Azure"); setPopoverOpen(false); } },
                { ico: <User className="h-3.5 w-3.5" />, label: "Сотрудник", action: () => { attachIntent({ type: "staff" }, ""); setPopoverOpen(false); } },
                { ico: <CreditCard className="h-3.5 w-3.5" />, label: "Оплата", action: () => { attachIntent({ type: "payment" }, ""); setPopoverOpen(false); } },
                { ico: <Calendar className="h-3.5 w-3.5" />, label: "План дня", action: () => { attachIntent({ type: "itinerary" }, ""); setPopoverOpen(false); } },
              ].map((it, i) => (
                <button key={i} onClick={it.action} className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-[var(--cream)] text-sm text-left">
                  <span className="text-[var(--gold-deep)]">{it.ico}</span>{it.label}
                </button>
              ))}
            </div>
          )}
          <input id="ph-input" type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) setPendingPhoto(f); }} />
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(input); } }}
            rows={1}
            placeholder="Спросите что угодно — бронирование, советы, локальные жемчужины…"
            className="flex-1 resize-none border border-[var(--line)] rounded-2xl px-3 py-2 text-sm focus:outline-none focus:border-[var(--gold)] focus:ring-1 focus:ring-[var(--gold)] bg-[var(--cream)]/40 max-h-24"
          />
          <button onClick={startVoice} className="h-9 w-9 rounded-full border border-[var(--line)] hover:bg-[var(--gold-soft)] flex items-center justify-center shrink-0">
            <Mic className="h-4 w-4" />
          </button>
          <button onClick={() => sendMessage(input)} disabled={!input.trim() || streaming}
            className="h-9 w-9 rounded-full bg-gradient-gold text-[var(--navy)] flex items-center justify-center shrink-0 hover:opacity-90 transition disabled:opacity-40">
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Voice overlay */}
      {voiceOpen && (
        <div className="absolute inset-0 bg-[var(--navy)]/95 backdrop-blur-sm flex flex-col items-center justify-center z-50 rounded-2xl">
          <div className="relative">
            <div className="h-24 w-24 rounded-full bg-gradient-gold flex items-center justify-center animate-pulse-gold">
              <Mic className="h-10 w-10 text-[var(--navy)]" />
            </div>
          </div>
          <div className="flex items-end gap-1 h-12 mt-6">
            {[...Array(7)].map((_, i) => (
              <div key={i} className="w-1 bg-[var(--gold)] rounded-full animate-wave" style={{ height: "100%", animationDelay: `${i * 0.1}s` }} />
            ))}
          </div>
          <p className="text-cream/80 mt-6 text-sm font-display italic min-h-6 max-w-xs text-center px-4">{transcript || "Слушаю…"}</p>
          <button onClick={() => { recRef.current?.stop?.(); setVoiceOpen(false); }} className="mt-6 text-cream/60 text-xs underline">Отмена</button>
        </div>
      )}
    </div>
  );
}
