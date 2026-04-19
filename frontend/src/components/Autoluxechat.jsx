import { useState, useRef, useEffect } from "react";

const API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY ?? "";

const allCars = [
  { id:1, type:"SUV",      brand:"Mahindra", model:"XUV700 AX7 L AWD",           price:"₹24.99 L", priceNum:24.99, year:2024, hp:"200 HP", speed:"200 kmph", acc:"8.5s",  badge:"NEW",    fuel:"Petrol"   },
  { id:2, type:"SUV",      brand:"Kia",      model:"Seltos X-Line 1.5 Turbo",    price:"₹19.65 L", priceNum:19.65, year:2024, hp:"160 HP", speed:"185 kmph", acc:"8.9s",  badge:"HOT",    fuel:"Petrol"   },
  { id:3, type:"Coupe",    brand:"Tata",     model:"Curvv EV 55 Empowered",      price:"₹21.99 L", priceNum:21.99, year:2024, hp:"167 HP", speed:"160 kmph", acc:"8.6s",  badge:"NEW",    fuel:"Electric" },
  { id:4, type:"Coupe",    brand:"Mahindra", model:"BE 6e Pack 3",               price:"₹26.90 L", priceNum:26.90, year:2025, hp:"286 HP", speed:"201 kmph", acc:"6.7s",  badge:"SPORT",  fuel:"Electric" },
  { id:5, type:"Mini-SUV", brand:"Kia",      model:"Sonet X-Line 1.0 T-GDi",    price:"₹14.89 L", priceNum:14.89, year:2024, hp:"120 HP", speed:"180 kmph", acc:"10.5s", badge:"NEW",    fuel:"Petrol"   },
  { id:6, type:"Mini-SUV", brand:"Skoda",    model:"Kushaq Monte Carlo 1.5 TSI", price:"₹17.99 L", priceNum:17.99, year:2024, hp:"150 HP", speed:"205 kmph", acc:"8.5s",  badge:"ELITE",  fuel:"Petrol"   },
  { id:7, type:"Sedan",    brand:"Skoda",    model:"Slavia Monte Carlo 1.5 TSI", price:"₹17.49 L", priceNum:17.49, year:2024, hp:"150 HP", speed:"212 kmph", acc:"8.1s",  badge:"HOT",    fuel:"Petrol"   },
  { id:8, type:"Sedan",    brand:"VW",       model:"Virtus GT 1.5 TSI DSG",      price:"₹16.99 L", priceNum:16.99, year:2024, hp:"150 HP", speed:"210 kmph", acc:"8.0s",  badge:"LUXURY", fuel:"Petrol"   },
];

const INVENTORY_TEXT = allCars.map(c =>
  `ID:${c.id} | ${c.brand} ${c.model} | ${c.type} | ${c.price} | ${c.year} | ${c.hp} | Top Speed:${c.speed} | 0-100:${c.acc} | ${c.fuel} | ${c.badge}`
).join("\n");

const TODAY_DATE = new Date().toISOString().split("T")[0];

const CHAT_SYSTEM = `You are AutoMate — the AI consultant for AutoLuxe, a premium Indian showroom. Be sharp, enthusiastic, and concise.

Inventory:
${INVENTORY_TEXT}

Rules:
- Keep replies to 2-3 punchy sentences. Use full model names.
- End every reply with one follow-up question to learn more about the customer.
- Never output JSON or tags — just natural conversation.`;

const RECOMMENDER_SYSTEM = `You are a car recommendation engine. Given a user's query and conversation, return ONLY a valid JSON array of car IDs (integers) from this inventory that best match the user's needs. Return an empty array [] if no cars match.

Inventory:
${INVENTORY_TEXT}

Matching rules:
- Budget/price: match cars within stated budget range
- Mileage/efficiency: prefer petrol cars (IDs 5,7,8 are most fuel-efficient small/mid cars)
- Electric/EV: IDs 3 and 4
- Performance/speed/fast: IDs 4, 6, 7, 8
- Family/space/SUV: IDs 1, 2
- City/daily use + low budget: IDs 5, 7, 8
- Brand-specific: match by brand name
- If user is asking to COMPARE two cars, return EXACTLY those 2 car IDs
- Return max 3 most relevant IDs, ordered by relevance
- Output ONLY valid JSON array like [5,7,8] — absolutely nothing else, no explanation, no markdown`;

const BOOKER_SYSTEM = `You are a car booking intent extractor. Given a user message, identify which SINGLE car they want to book a test drive for, and extract date/time if mentioned.

Inventory:
${INVENTORY_TEXT}

Today's date is ${TODAY_DATE}.

Rules:
- Return ONLY a valid JSON object with keys: "brand", "model", "date" (YYYY-MM-DD format, empty string if not mentioned), "time" (HH:MM 24-hour format, empty string if not mentioned).
- Resolve relative dates: "today" = ${TODAY_DATE}, "tomorrow" = next calendar day.
- Convert 12-hour to 24-hour time: "6:30pm" = "18:30", "9am" = "09:00".
- If no specific car is clearly mentioned, return {}.
- Example output: {"brand":"Skoda","model":"Slavia Monte Carlo 1.5 TSI","date":"2025-04-19","time":"18:30"}
- Output ONLY the JSON object — absolutely nothing else, no explanation, no markdown.`;

async function callLLM(systemPrompt, messages, maxTokens = 400) {
  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${API_KEY}`,
      "HTTP-Referer": "https://autoluxe.in",
      "X-Title": "AutoLuxe Chat",
    },
    body: JSON.stringify({
      models: [
        "openai/gpt-oss-120b:free",
        "meta-llama/llama-3.3-70b-instruct:free",
        "google/gemma-3-27b-it:free",
      ],
      messages: [{ role: "system", content: systemPrompt }, ...messages],
      max_tokens: maxTokens,
      temperature: 0.4,
    }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || `API error ${res.status}`);
  }
  const data = await res.json();
  return data.choices?.[0]?.message?.content || "";
}

function parseRecommendedIds(raw) {
  try {
    const clean = raw.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);
    if (Array.isArray(parsed)) return parsed.map(Number).filter(n => n > 0 && n <= 8);
  } catch {}
  const nums = raw.match(/\d+/g);
  return nums ? [...new Set(nums.map(Number).filter(n => n >= 1 && n <= 8))] : [];
}

function parseBooking(raw) {
  try {
    const clean = raw.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);
    if (parsed && parsed.brand && parsed.model) return parsed;
  } catch {}
  return null;
}

function isCompareIntent(text) {
  return /\bvs\.?\b|\bversus\b|\bcompare\b|\bcomparison\b|\bwhich is better\b/i.test(text);
}

function isBookIntent(text) {
  return /\bbook\b|\bschedule\b|\btest.?drive\b|\breserve\b|\bappointment\b|\bwant to (try|drive|test)\b/i.test(text);
}

const BADGE_STYLE = {
  NEW:    { border: "#34d39940", color: "#34d399" },
  HOT:    { border: "#fb923c40", color: "#fb923c" },
  SPORT:  { border: "#f8717140", color: "#f87171" },
  LUXURY: { border: "#fbbf2440", color: "#fbbf24" },
  ELITE:  { border: "#22d3ee40", color: "#22d3ee" },
};

const BotIcon = ({ size = 28, color = "#0dcfba", darkEye = false }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
    <line x1="32" y1="5" x2="32" y2="14" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
    <circle cx="32" cy="4" r="3" fill={color} />
    <rect x="9" y="14" width="46" height="29" rx="9" fill={color + "18"} stroke={color} strokeWidth="2.2" />
    <rect x="17" y="22" width="10" height="9" rx="3" fill={color} />
    <rect x="37" y="22" width="10" height="9" rx="3" fill={color} />
    {darkEye && (
      <>
        <rect x="19" y="24" width="3" height="3" rx="1" fill="#000" opacity="0.45" />
        <rect x="39" y="24" width="3" height="3" rx="1" fill="#000" opacity="0.45" />
      </>
    )}
    <rect x="19" y="35" width="26" height="3.5" rx="1.75" fill={color} opacity="0.5" />
    <rect x="19" y="45" width="26" height="13" rx="6" fill={color + "18"} stroke={color} strokeWidth="2.2" />
    <circle cx="27" cy="51.5" r="2.5" fill={color} />
    <circle cx="37" cy="51.5" r="2.5" fill={color} />
    <rect x="2" y="47" width="15" height="6" rx="3" fill={color + "18"} stroke={color} strokeWidth="2.2" />
    <rect x="47" y="47" width="15" height="6" rx="3" fill={color + "18"} stroke={color} strokeWidth="2.2" />
  </svg>
);

function CarCard({ car, onViewCar, onBookCar }) {
  const badge = BADGE_STYLE[car.badge] || BADGE_STYLE.NEW;
  return (
    <div style={{ marginTop: 8, borderRadius: 12, overflow: "hidden", background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.07)" }}>
      <div style={{ height: 2, background: "linear-gradient(90deg,#0dcfba,#0dcfba50,transparent)" }} />
      <div style={{ padding: "10px 12px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
          <div style={{ minWidth: 0, flex: 1 }}>
            <p style={{ fontSize: 8, letterSpacing: "0.22em", textTransform: "uppercase", color: "#0dcfba77", marginBottom: 2 }}>{car.brand}</p>
            <p style={{ fontWeight: 800, color: "#fff", fontSize: 12, lineHeight: 1.2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{car.model}</p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4, marginLeft: 8, flexShrink: 0 }}>
            <span style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.18em", padding: "2px 6px", borderRadius: 4, border: `1px solid ${badge.border}`, color: badge.color, background: badge.border + "22" }}>{car.badge}</span>
            <span style={{ fontSize: 8, textTransform: "uppercase", letterSpacing: "0.14em", color: "rgba(255,255,255,0.2)" }}>{car.type}</span>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 4, marginBottom: 8 }}>
          {[["Price", car.price, "#0dcfba"], ["HP", car.hp, "#fff"], ["Top", car.speed, "#fff"], ["0-100", car.acc, "#fff"]].map(([l, v, c]) => (
            <div key={l} style={{ background: "rgba(255,255,255,0.04)", borderRadius: 8, padding: "6px 4px" }}>
              <p style={{ fontSize: 7, textTransform: "uppercase", letterSpacing: "0.15em", color: "rgba(255,255,255,0.22)", marginBottom: 2 }}>{l}</p>
              <p style={{ fontSize: 9, fontWeight: 700, color: c, lineHeight: 1 }}>{v}</p>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
          <span style={{ fontSize: 9, color: "rgba(255,255,255,0.25)" }}>{car.fuel === "Electric" ? "⚡" : "⛽"} {car.fuel} · {car.year}</span>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#0dcfba", display: "inline-block" }} />
            <span style={{ fontSize: 8, color: "rgba(255,255,255,0.2)" }}>In Stock</span>
          </span>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          <button onClick={onViewCar} style={{ flex: 1, padding: "7px 0", borderRadius: 8, fontSize: 9, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", background: "rgba(13,207,186,0.1)", border: "1px solid rgba(13,207,186,0.35)", color: "#0dcfba", cursor: "pointer", transition: "filter 0.2s" }} onMouseEnter={e => e.currentTarget.style.filter = "brightness(1.3)"} onMouseLeave={e => e.currentTarget.style.filter = "brightness(1)"}>View →</button>
          <button onClick={onBookCar} style={{ flex: 1, padding: "7px 0", borderRadius: 8, fontSize: 9, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", background: "rgba(224,123,42,0.1)", border: "1px solid rgba(224,123,42,0.35)", color: "#e07b2a", cursor: "pointer", transition: "filter 0.2s" }} onMouseEnter={e => e.currentTarget.style.filter = "brightness(1.3)"} onMouseLeave={e => e.currentTarget.style.filter = "brightness(1)"}>Book →</button>
        </div>
      </div>
    </div>
  );
}

function CompareBanner({ cards }) {
  return (
    <div style={{ marginTop: 10, borderRadius: 10, padding: "10px 12px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#0dcfba" strokeWidth="2.5" strokeLinecap="round"><path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18"/></svg>
        <p style={{ fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(13,207,186,0.6)" }}>Comparison loaded ↓</p>
      </div>
      <p style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", lineHeight: 1.5 }}>{cards[0].brand} {cards[0].model.split(" ")[0]} vs {cards[1].brand} {cards[1].model.split(" ")[0]}</p>
    </div>
  );
}

function BookBanner({ car }) {
  return (
    <div style={{ marginTop: 10, borderRadius: 10, padding: "10px 12px", background: "rgba(224,123,42,0.06)", border: "1px solid rgba(224,123,42,0.22)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#e07b2a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
        <p style={{ fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(224,123,42,0.6)" }}>Booking Form Loaded ↓</p>
      </div>
      <p style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", lineHeight: 1.5 }}>{car.brand} {car.model}</p>
    </div>
  );
}

function Dots() {
  return (
    <div style={{ display: "flex", gap: 5, alignItems: "center", padding: "4px 0" }}>
      {[0, 1, 2].map(i => (
        <span key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: "#0dcfba", display: "block", animation: `chatDotBounce 0.9s ${i * 0.18}s ease-in-out infinite` }} />
      ))}
    </div>
  );
}

const QUICK = [
  "Daily city use, best mileage",
  "Best EV under ₹25L?",
  "Compare XUV700 vs Seltos",
  "Book Slavia test drive",
];

export default function AutoLuxeChat({ onViewCar, onCompare, onBookTestDrive }) {
  const [open, setOpen]         = useState(false);
  const [messages, setMessages] = useState([{
    role: "assistant",
    text: "Welcome to AutoLuxe. I'm AutoMate — your AI car consultant. Ask about any car, compare models, or say 'book test drive'! 🏎️",
    cards: [], isCompare: false, isBook: false, bookedCar: null,
  }]);
  const [input, setInput]     = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const [unread, setUnread]   = useState(1);
  const bottomRef             = useRef(null);

  useEffect(() => {
    if (open) setUnread(0);
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 60);
  }, [messages, loading, open]);

  async function send(text) {
    const msg = (text || input).trim();
    if (!msg || loading) return;
    setInput("");
    setError("");

    const history       = messages.map(m => ({ role: m.role, content: m.text }));
    const userMsg       = { role: "user", content: msg };
    const compareIntent = isCompareIntent(msg);
    const bookIntent    = isBookIntent(msg);

    setMessages(prev => [...prev, { role: "user", text: msg, cards: [], isCompare: false, isBook: false, bookedCar: null }]);
    setLoading(true);

    try {
      const [chatRaw, recRaw, bookRaw] = await Promise.all([
        callLLM(CHAT_SYSTEM,        [...history, userMsg], 450),
        callLLM(RECOMMENDER_SYSTEM, [userMsg],             80),
        bookIntent ? callLLM(BOOKER_SYSTEM, [userMsg], 120) : Promise.resolve("{}"),
      ]);

      const recommendedIds = parseRecommendedIds(recRaw);
      const cards          = recommendedIds.map(id => allCars.find(c => c.id === id)).filter(Boolean);
      const isCompare      = compareIntent && cards.length === 2;

      const booking   = bookIntent ? parseBooking(bookRaw) : null;
      const bookedCar = booking
        ? allCars.find(c => c.brand === booking.brand && c.model === booking.model)
        : null;
      const isBook = !!bookedCar && !isCompare;

      setMessages(prev => [...prev, {
        role: "assistant",
        text: chatRaw.trim(),
        cards,
        isCompare,
        isBook,
        bookedCar: bookedCar || null,
      }]);
      if (!open) setUnread(u => u + 1);

      if (isCompare) {
        setOpen(false);
        onCompare?.([cards[0].id, cards[1].id]);
      }
      if (isBook) {
        setOpen(false);
        onBookTestDrive?.({
          brand: bookedCar.brand,
          model: bookedCar.model,
          date: booking.date || "",
          time: booking.time || "",
        });
      }
    } catch (e) {
      setError(e.message || "Something went wrong. Check your API key.");
    } finally {
      setLoading(false);
    }
  }

  const chatPanel = (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ flex: 1, overflowY: "auto", padding: "12px 14px", display: "flex", flexDirection: "column", gap: 14, scrollbarWidth: "none" }}>
        <style>{`
          @keyframes chatDotBounce {
            0%,100% { transform: translateY(0); opacity: 0.5; }
            50%      { transform: translateY(-5px); opacity: 1; }
          }
        `}</style>

        {messages.map((m, i) => (
          <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
            <div style={{ maxWidth: "92%" }}>
              {m.role === "assistant" && (
                <p style={{ fontSize: 8, letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(13,207,186,0.45)", marginBottom: 5 }}>AutoMate</p>
              )}
              <div style={{ borderRadius: 14, padding: "9px 13px", fontSize: 12, lineHeight: 1.55, ...(m.role === "user" ? { background: "#0dcfba", color: "#000", fontWeight: 600, borderBottomRightRadius: 4 } : { background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.83)", borderTopLeftRadius: 4 }) }}>
                {m.text}
              </div>
              {m.cards?.length > 0 && !m.isCompare && !m.isBook && (
                <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 4 }}>
                  {m.cards.map(car => (
                    <CarCard key={car.id} car={car} onViewCar={() => { onViewCar?.(car.id); setOpen(false); }} onBookCar={() => { onBookTestDrive?.({ brand: car.brand, model: car.model, date: "", time: "" }); setOpen(false); }} />
                  ))}
                </div>
              )}
              {m.isCompare && m.cards?.length === 2 && <CompareBanner cards={m.cards} />}
              {m.isBook && m.bookedCar && <BookBanner car={m.bookedCar} />}
            </div>
          </div>
        ))}

        {loading && (
          <div style={{ display: "flex", justifyContent: "flex-start" }}>
            <div>
              <p style={{ fontSize: 8, letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(13,207,186,0.45)", marginBottom: 5 }}>AutoMate</p>
              <div style={{ padding: "9px 14px", borderRadius: 14, borderTopLeftRadius: 4, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.07)" }}>
                <Dots />
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 6, padding: "4px 10px", borderRadius: 8, background: "rgba(13,207,186,0.06)", border: "1px solid rgba(13,207,186,0.18)", width: "fit-content" }}>
                <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#0dcfba", display: "inline-block", animation: "chatDotBounce 1.2s ease-in-out infinite" }} />
                <span style={{ fontSize: 9, color: "rgba(13,207,186,0.65)" }}>Analysing your needs…</span>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div style={{ padding: "8px 12px", borderRadius: 10, fontSize: 11, textAlign: "center", background: "rgba(255,0,0,0.08)", border: "1px solid rgba(255,0,0,0.2)", color: "#f87171" }}>{error}</div>
        )}
        <div ref={bottomRef} />
      </div>

      {messages.length === 1 && (
        <div style={{ padding: "0 12px 8px", display: "flex", flexWrap: "wrap", gap: 5 }}>
          {QUICK.map(q => (
            <button key={q} onClick={() => send(q)} style={{ fontSize: 10, padding: "5px 10px", borderRadius: 20, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(13,207,186,0.25)", color: "#0dcfba", cursor: "pointer", transition: "background 0.2s" }} onMouseEnter={e => e.currentTarget.style.background = "rgba(13,207,186,0.1)"} onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.04)"}>{q}</button>
          ))}
        </div>
      )}

      <div style={{ padding: "8px 12px 12px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
          <textarea value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }} placeholder="Ask, compare or book…" rows={1} style={{ flex: 1, resize: "none", borderRadius: 10, padding: "9px 12px", fontSize: 12, outline: "none", lineHeight: 1.4, maxHeight: 72, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.88)", fontFamily: "inherit" }} />
          <button onClick={() => send()} disabled={loading || !input.trim()} style={{ width: 38, height: 38, borderRadius: 10, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", background: loading || !input.trim() ? "rgba(255,255,255,0.05)" : "#0dcfba", opacity: loading || !input.trim() ? 0.35 : 1, border: "none", cursor: loading || !input.trim() ? "default" : "pointer", transition: "all 0.2s" }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div style={{ position: "fixed", bottom: 88, right: 20, zIndex: 50, width: 340, height: open ? 520 : 0, opacity: open ? 1 : 0, borderRadius: 18, background: "#0d0d0d", border: open ? "1px solid rgba(13,207,186,0.18)" : "none", boxShadow: open ? "0 28px 72px rgba(0,0,0,0.75), 0 0 48px rgba(13,207,186,0.05)" : "none", pointerEvents: open ? "auto" : "none", transformOrigin: "bottom right", transform: open ? "scale(1) translateY(0)" : "scale(0.9) translateY(20px)", transition: "height 0.32s cubic-bezier(0.4,0,0.2,1), opacity 0.24s ease, transform 0.32s cubic-bezier(0.4,0,0.2,1)", display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <div style={{ height: 2, background: "linear-gradient(90deg,#0dcfba,rgba(13,207,186,0.4),transparent)", flexShrink: 0 }} />
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", flexShrink: 0, borderBottom: "1px solid rgba(255,255,255,0.06)", background: "#080808" }}>
          <div style={{ width: 34, height: 34, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, background: "rgba(13,207,186,0.1)", border: "1px solid rgba(13,207,186,0.3)" }}>
            <BotIcon size={18} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontWeight: 900, fontSize: 13, letterSpacing: "0.12em", color: "#fff" }}>AUTO<span style={{ color: "#0dcfba" }}>MATE</span></p>
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#0dcfba", display: "inline-block", animation: "chatDotBounce 2s ease-in-out infinite" }} />
              <span style={{ fontSize: 9, letterSpacing: "0.18em", color: "rgba(255,255,255,0.28)" }}>AI · {allCars.length} cars</span>
            </div>
          </div>
          <button onClick={() => setOpen(false)} style={{ width: 26, height: 26, borderRadius: 8, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "transparent", border: "none", color: "rgba(255,255,255,0.3)", cursor: "pointer", transition: "background 0.2s" }} onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.06)"} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </button>
        </div>
        <div style={{ flex: 1, minHeight: 0 }}>{chatPanel}</div>
      </div>

      <button onClick={() => setOpen(o => !o)} style={{ position: "fixed", bottom: 20, right: 20, zIndex: 50, width: 58, height: 58, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: open ? "#0dcfba" : "#0d0d0d", border: "2px solid #0dcfba", boxShadow: "0 6px 28px rgba(13,207,186,0.35), 0 2px 10px rgba(0,0,0,0.6)", cursor: "pointer", transition: "all 0.2s ease" }}>
        {!open && <span style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "rgba(13,207,186,0.15)", animation: "chatPing 2.4s ease-in-out infinite" }} />}
        {!open && unread > 0 && <span style={{ position: "absolute", top: -3, right: -3, width: 18, height: 18, borderRadius: "50%", fontSize: 9, fontWeight: 900, display: "flex", alignItems: "center", justifyContent: "center", background: "#f97316", color: "#fff", zIndex: 10 }}>{unread}</span>}
        {open ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2.8" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg> : <BotIcon size={26} darkEye />}
        <style>{`
          @keyframes chatPing {
            0%   { transform: scale(1);   opacity: 0.7; }
            70%  { transform: scale(1.6); opacity: 0; }
            100% { transform: scale(1.6); opacity: 0; }
          }
        `}</style>
      </button>
    </>
  );
}