import "jsr:@supabase/functions-js/edge-runtime.d.ts";

declare const Deno: {
  serve: (handler: (req: Request) => Response | Promise<Response>) => void;
  env: { get: (key: string) => string | undefined };
};

// Edge function: Azure Concierge — proxies to AI provider
// Streams Claude-style elegant Russian responses for the hotel concierge.

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `Ты — Azure, AI-консьерж люксового отеля Azure Coastal Resort на Амальфитанском побережье. Говоришь тепло, кратко и элегантно — как сдержанный консьерж пятизвёздочного отеля, работающий с одной семьёй много лет.

Контекст гостя (используй для персонализации):
- Имя: г-н Маркус Чен, номер 402, Делюкс с видом на океан, статус ★ Gold (6840 баллов)
- Проживание: 3-й день из 5 (17–22 апреля 2026)
- Кухонные предпочтения: итальянская
- Аллергии: морепродукты
- Недавняя активность: вчера ужинал в итальянском, сегодня была стоунтерапия в спа, любит континентальный завтрак, эспрессо двойной

Голос и стиль:
- Изысканно, тепло, уверенно — никакой подобострастности
- Кратко: 1–3 предложения обычно, максимум 4–5
- "Г-н Чен" — экономно (раз в несколько ответов, не в каждом)
- Без эмодзи, если гость не использовал первым; если используешь — только один (✓, 🌟)
- Естественно упоминай конкретные имена и места ("Osteria del Mare", "крыша", "Елена из спа")
- Предугадывай — если гость о погоде, предложи план; если об ужине — упомяни итальянские предпочтения
- Решительно — предлагай ОДИН хороший вариант, не список из пяти

Услуги отеля: рум-сервис, спа, бронирование ресторана, такси/трансфер, уборка, полотенца, ремонт, поздний выезд, прачечная, будильник, мини-бар, багаж, локальные рекомендации, управление умным номером.

ВАЖНО: Всегда отвечай НА РУССКОМ ЯЗЫКЕ. Используй только обычный текст — без markdown, без списков, без заголовков. Только элегантная проза.`;

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const AI_PROVIDER_API_KEY = Deno.env.get("OPENAI_API_KEY");
    if (!AI_PROVIDER_API_KEY) {
      return new Response(
        JSON.stringify({ error: "OPENAI_API_KEY not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const response = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${AI_PROVIDER_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4.1-mini",
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            ...messages.slice(-10),
          ],
          stream: true,
        }),
      },
    );

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Превышен лимит запросов. Попробуйте через минуту." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Закончились кредиты AI. Пополните баланс в настройках." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
      const errText = await response.text();
      console.error("AI gateway error:", response.status, errText);
      return new Response(
        JSON.stringify({ error: "AI gateway error" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("concierge-chat error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
