import { useState, useRef, useEffect } from "react";

/* ─── ENV KEY ────────────────────────────────────────────────────────────── */
const API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY ?? "";

/* ─── DATA ──────────────────────────────────────────────────────────────── */
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

/* ─── PROMPTS ────────────────────────────────────────────────────────────── */
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

const BOOKER_SYSTEM = `You are a car booking intent extractor. Given a user message, identify which SINGLE car they want to book a test drive for from this inventory.

Inventory:
${INVENTORY_TEXT}

Rules:
- Return ONLY a valid JSON object with "brand" and "model" keys matching EXACTLY from the inventory above.
- If no specific car is clearly mentioned, return {}.
- Example output: {"brand":"Skoda","model":"Slavia Monte Carlo 1.5 TSI"}
- Output ONLY the JSON object — nothing else, no explanation, no markdown.`;

/* ─── API ────────────────────────────────────────────────────────────────── */
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

/* ─── HELPERS ────────────────────────────────────────────────────────────── */
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

/* ─── BADGE STYLES ───────────────────────────────────────────────────────── */
const BADGE_STYLE = {
  NEW:    { border: "#34d39940", color: "#34d399" },
  HOT:    { border: "#fb923c40", color: "#fb923c" },
  SPORT:  { border: "#f8717140", color: "#f87171" },
  LUXURY: { border: "#fbbf2440", color: "#fbbf24" },
  ELITE:  { border: "#22d3ee40", color: "#22d3ee" },
};

/* ─── ICONS ──────────────────────────────────────────────────────────────── */
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

/* ─── CAR CARD ───────────────────────────────────────────────────────────── */
function CarCard({ car, onViewCar, onBookCar }) {
  const badge = BADGE_STYLE[car.badge] || BADGE_STYLE.NEW;
  return (
    <div className="mt-2 rounded-xl overflow-hidden" style={{ background: "#0a0a0a", border: "1px solid #ffffff12" }}>
      <div style={{ height: 2, background: "linear-gradient(90deg,#0dcfba,#0dcfba50,transparent)" }} />
      <div className="p-3">
        <div className="flex justify-between items-start mb-2">
          <div>
            <p className="text-[9px] tracking-[0.22em] uppercase mb-0.5" style={{ color: "#0dcfba77" }}>{car.brand}</p>
            <p className="font-black text-white text-[13px] leading-tight">{car.model}</p>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className="text-[9px] font-bold tracking-widest px-1.5 py-0.5 rounded"
              style={{ border: `1px solid ${badge.border}`, color: badge.color, background: badge.border + "22" }}>
              {car.badge}
            </span>
            <span className="text-[9px] uppercase tracking-wider" style={{ color: "#ffffff28" }}>{car.type}</span>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-1 mb-2">
          {[["Price", car.price, "#0dcfba"], ["Power", car.hp, "#fff"], ["Speed", car.speed, "#fff"], ["0–100", car.acc, "#fff"]].map(([l, v, c]) => (
            <div key={l} className="rounded-lg px-1.5 py-1.5" style={{ background: "#ffffff07" }}>
              <p className="text-[8px] uppercase tracking-wider mb-0.5" style={{ color: "#ffffff28" }}>{l}</p>
              <p className="text-[10px] font-bold leading-none" style={{ color: c }}>{v}</p>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between mb-2.5">
          <span className="text-[10px]" style={{ color: "#ffffff30" }}>
            {car.fuel === "Electric" ? "⚡" : "⛽"} {car.fuel} · {car.year}
          </span>
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#0dcfba" }} />
            <span className="text-[9px]" style={{ color: "#ffffff25" }}>In Stock</span>
          </div>
        </div>

        <div className="flex gap-2">
          <button onClick={onViewCar}
            className="flex-1 py-1.5 rounded-lg text-[10px] font-bold tracking-[0.15em] uppercase transition-all active:scale-95 hover:brightness-125"
            style={{ background: "#0dcfba18", border: "1px solid #0dcfba45", color: "#0dcfba" }}>
            View →
          </button>
          <button onClick={onBookCar}
            className="flex-1 py-1.5 rounded-lg text-[10px] font-bold tracking-[0.15em] uppercase transition-all active:scale-95 hover:brightness-125"
            style={{ background: "#e07b2a18", border: "1px solid #e07b2a45", color: "#e07b2a" }}>
            Book Drive →
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── COMPARE BANNER ─────────────────────────────────────────────────────── */
function CompareBanner({ cards }) {
  return (
    <div className="mt-3 rounded-xl p-3 flex flex-col gap-2" style={{ background: "#ffffff06", border: "1px solid #ffffff10" }}>
      <div className="flex items-center gap-2">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#0dcfba" strokeWidth="2.5" strokeLinecap="round">
          <path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18"/>
        </svg>
        <p className="text-[10px] tracking-wider uppercase" style={{ color: "#0dcfba88" }}>Comparison loaded ↓</p>
      </div>
      <p className="text-[11px] leading-relaxed" style={{ color: "#ffffff50" }}>
        {cards[0].brand} {cards[0].model.split(" ")[0]} vs {cards[1].brand} {cards[1].model.split(" ")[0]} — scroll down to see specs
      </p>
    </div>
  );
}

/* ─── BOOK BANNER ────────────────────────────────────────────────────────── */
function BookBanner({ car }) {
  return (
    <div className="mt-3 rounded-xl p-3 flex flex-col gap-2" style={{ background: "#e07b2a0a", border: "1px solid #e07b2a28" }}>
      <div className="flex items-center gap-2">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#e07b2a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
        <p className="text-[10px] tracking-wider uppercase" style={{ color: "#e07b2a88" }}>Booking Form Loaded ↓</p>
      </div>
      <p className="text-[11px] leading-relaxed" style={{ color: "#ffffff50" }}>
        {car.brand} {car.model} — scroll down to complete your test drive booking
      </p>
    </div>
  );
}

/* ─── DOTS ───────────────────────────────────────────────────────────────── */
function Dots() {
  return (
    <div className="flex gap-1 items-center py-1">
      {[0, 1, 2].map(i => (
        <span key={i} className="w-1.5 h-1.5 rounded-full animate-bounce block"
          style={{ background: "#0dcfba", animationDelay: `${i * 0.18}s` }} />
      ))}
    </div>
  );
}

const QUICK = [
  "Daily city use, best mileage petrol",
  "Best EV under ₹25L?",
  "Compare XUV700 vs Seltos",
  "Book Slavia Monte Carlo test drive",
];

/* ─── MAIN ───────────────────────────────────────────────────────────────── */
export default function AutoLuxeChat({ onViewCar, onCompare, onBookTestDrive }) {
  const [open, setOpen]         = useState(false);
  const [messages, setMessages] = useState([{
    role: "assistant",
    text: "Welcome to AutoLuxe. I'm AutoMate — your AI car consultant. Ask about any car, compare models, or say 'book test drive' for any vehicle! 🏎️",
    cards: [], isCompare: false, isBook: false, bookedCar: null,
  }]);
  const [input, setInput]       = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const [unread, setUnread]     = useState(1);
  const bottomRef               = useRef(null);

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
      // Run all three LLMs in parallel; booker only fires on book intent
      const [chatRaw, recRaw, bookRaw] = await Promise.all([
        callLLM(CHAT_SYSTEM,        [...history, userMsg], 450),
        callLLM(RECOMMENDER_SYSTEM, [userMsg],             80),
        bookIntent
          ? callLLM(BOOKER_SYSTEM, [userMsg], 80)
          : Promise.resolve("{}"),
      ]);

      const recommendedIds = parseRecommendedIds(recRaw);
      const cards          = recommendedIds.map(id => allCars.find(c => c.id === id)).filter(Boolean);
      const isCompare      = compareIntent && cards.length === 2;

      const booking   = bookIntent ? parseBooking(bookRaw) : null;
      const bookedCar = booking
        ? allCars.find(c => c.brand === booking.brand && c.model === booking.model)
        : null;
      const isBook    = !!bookedCar && !isCompare;

      setMessages(prev => [...prev, {
        role: "assistant",
        text: chatRaw.trim(),
        cards,
        isCompare,
        isBook,
        bookedCar: bookedCar || null,
      }]);
      if (!open) setUnread(u => u + 1);

      // ── Auto-redirect: compare ────────────────────────────────────────────
      if (isCompare) {
        setOpen(false);
        onCompare?.([cards[0].id, cards[1].id]);
      }

      // ── Auto-redirect: book test drive ────────────────────────────────────
      if (isBook) {
        setOpen(false);
        onBookTestDrive?.({ brand: bookedCar.brand, model: bookedCar.model });
      }
    } catch (e) {
      setError(e.message || "Something went wrong. Check your API key.");
    } finally {
      setLoading(false);
    }
  }

  const chatScreen = (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4" style={{ scrollbarWidth: "none" }}>
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className="max-w-[90%]">
              {m.role === "assistant" && (
                <p className="text-[9px] tracking-[0.22em] uppercase mb-1.5" style={{ color: "#0dcfba50" }}>AutoMate</p>
              )}
              <div className="rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed"
                style={m.role === "user"
                  ? { background: "#0dcfba", color: "#000", fontWeight: 600, borderBottomRightRadius: 4 }
                  : { background: "#ffffff0c", border: "1px solid #ffffff0e", color: "rgba(255,255,255,.85)", borderTopLeftRadius: 4 }}>
                {m.text}
              </div>

              {/* Car cards — regular recommendations only */}
              {m.cards && m.cards.length > 0 && !m.isCompare && !m.isBook && (
                <div className="space-y-2 mt-1">
                  {m.cards.map(car => (
                    <CarCard key={car.id} car={car}
                      onViewCar={() => { onViewCar?.(car.id); setOpen(false); }}
                      onBookCar={() => { onBookTestDrive?.({ brand: car.brand, model: car.model }); setOpen(false); }}
                    />
                  ))}
                </div>
              )}

              {/* Compare banner */}
              {m.isCompare && m.cards?.length === 2 && <CompareBanner cards={m.cards} />}

              {/* Book banner */}
              {m.isBook && m.bookedCar && <BookBanner car={m.bookedCar} />}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start gap-2 items-start">
            <div>
              <p className="text-[9px] tracking-[0.22em] uppercase mb-1.5" style={{ color: "#0dcfba50" }}>AutoMate</p>
              <div className="px-3.5 py-2.5 rounded-2xl"
                style={{ background: "#ffffff0c", border: "1px solid #ffffff0e", borderTopLeftRadius: 4 }}>
                <Dots />
              </div>
              <div className="flex items-center gap-1.5 mt-1.5 px-2 py-1 rounded-lg w-fit"
                style={{ background: "#0dcfba10", border: "1px solid #0dcfba22" }}>
                <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#0dcfba" }} />
                <span className="text-[10px]" style={{ color: "#0dcfba77" }}>Analysing your needs…</span>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="px-3 py-2 rounded-xl text-[11px] text-center"
            style={{ background: "#ff000015", border: "1px solid #ff000028", color: "#f87171" }}>
            {error}
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {messages.length === 1 && (
        <div className="px-3 pb-2 flex flex-wrap gap-1.5">
          {QUICK.map(q => (
            <button key={q} onClick={() => send(q)}
              className="text-[11px] px-3 py-1.5 rounded-full active:scale-95 transition-all"
              style={{ background: "#ffffff07", border: "1px solid #0dcfba30", color: "#0dcfba" }}>
              {q}
            </button>
          ))}
        </div>
      )}

      <div className="px-3 pb-3 pt-2" style={{ borderTop: "1px solid #ffffff08" }}>
        <div className="flex gap-2 items-end">
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
            placeholder="Ask, compare or book — e.g. Book Slavia test drive"
            rows={1}
            className="flex-1 resize-none rounded-xl px-3.5 py-2.5 text-[13px] outline-none leading-snug"
            style={{ background: "#ffffff0d", border: "1px solid #ffffff15", color: "rgba(255,255,255,.88)", maxHeight: 80 }}
          />
          <button onClick={() => send()} disabled={loading || !input.trim()}
            className="w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center active:scale-90 transition-all"
            style={{ background: loading || !input.trim() ? "#ffffff0a" : "#0dcfba", opacity: loading || !input.trim() ? 0.35 : 1 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="fixed bottom-24 right-6 z-50 flex flex-col overflow-hidden"
        style={{
          width: 368,
          height: open ? 580 : 0,
          opacity: open ? 1 : 0,
          borderRadius: 20,
          background: "#0d0d0d",
          border: open ? "1px solid #0dcfba25" : "none",
          boxShadow: open ? "0 32px 80px #000000bb, 0 0 60px #0dcfba08" : "none",
          pointerEvents: open ? "auto" : "none",
          transformOrigin: "bottom right",
          transform: open ? "scale(1) translateY(0)" : "scale(0.88) translateY(24px)",
          transition: "height .32s cubic-bezier(.4,0,.2,1), opacity .24s ease, transform .32s cubic-bezier(.4,0,.2,1)",
        }}>
        <div style={{ height: 2, background: "linear-gradient(90deg,#0dcfba,#0dcfba60,transparent)" }} />

        <div className="flex items-center gap-3 px-4 py-3 flex-shrink-0"
          style={{ borderBottom: "1px solid #ffffff08", background: "#080808" }}>
          <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ background: "#0dcfba15", border: "1px solid #0dcfba38" }}>
            <BotIcon size={20} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-black text-[14px] tracking-wider text-white">
              AUTO<span style={{ color: "#0dcfba" }}>MATE</span>
            </p>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#0dcfba" }} />
              <span className="text-[10px] tracking-wider" style={{ color: "#ffffff33" }}>
                AI · {allCars.length} cars · Dual LLM
              </span>
            </div>
          </div>
          <button onClick={() => setOpen(false)}
            className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-white/5 transition-colors"
            style={{ color: "#ffffff35" }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="flex-1 min-h-0">{chatScreen}</div>
      </div>

      <button onClick={() => setOpen(o => !o)}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full flex items-center justify-center active:scale-90 transition-all duration-200"
        style={{ background: open ? "#0dcfba" : "#0d0d0d", border: "2.5px solid #0dcfba", boxShadow: "0 8px 36px #0dcfba44, 0 2px 12px #00000066" }}>
        {!open && <span className="absolute inset-0 rounded-full animate-ping" style={{ background: "#0dcfba1a", animationDuration: "2.4s" }} />}
        {!open && unread > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-[10px] font-black flex items-center justify-center z-10"
            style={{ background: "#f97316", color: "#fff" }}>{unread}</span>
        )}
        {open
          ? <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2.8" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          : <BotIcon size={30} darkEye />
        }
      </button>
    </>
  );
}