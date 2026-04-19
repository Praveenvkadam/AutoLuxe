import { useState, useMemo, useEffect } from "react";

const allCars = [
  { id: 1, type: "SUV",      brand: "Mahindra", model: "XUV700 AX7 L AWD",           price: "₹24.99 L", year: 2024, hp: "200 HP", speed: "200", acc: "8.5",  badge: "NEW",    fuel: "Petrol"   },
  { id: 2, type: "SUV",      brand: "Kia",      model: "Seltos X-Line 1.5 Turbo",    price: "₹19.65 L", year: 2024, hp: "160 HP", speed: "185", acc: "8.9",  badge: "HOT",    fuel: "Petrol"   },
  { id: 3, type: "Coupe",    brand: "Tata",     model: "Curvv EV 55 Empowered",      price: "₹21.99 L", year: 2024, hp: "167 HP", speed: "160", acc: "8.6",  badge: "NEW",    fuel: "Electric" },
  { id: 4, type: "Coupe",    brand: "Mahindra", model: "BE 6e Pack 3",               price: "₹26.90 L", year: 2025, hp: "286 HP", speed: "201", acc: "6.7",  badge: "SPORT",  fuel: "Electric" },
  { id: 5, type: "Mini-SUV", brand: "Kia",      model: "Sonet X-Line 1.0 T-GDi",    price: "₹14.89 L", year: 2024, hp: "120 HP", speed: "180", acc: "10.5", badge: "NEW",    fuel: "Petrol"   },
  { id: 6, type: "Mini-SUV", brand: "Skoda",    model: "Kushaq Monte Carlo 1.5 TSI", price: "₹17.99 L", year: 2024, hp: "150 HP", speed: "205", acc: "8.5",  badge: "ELITE",  fuel: "Petrol"   },
  { id: 7, type: "Sedan",    brand: "Skoda",    model: "Slavia Monte Carlo 1.5 TSI", price: "₹17.49 L", year: 2024, hp: "150 HP", speed: "212", acc: "8.1",  badge: "HOT",    fuel: "Petrol"   },
  { id: 8, type: "Sedan",    brand: "VW",       model: "Virtus GT 1.5 TSI DSG",      price: "₹16.99 L", year: 2024, hp: "150 HP", speed: "210", acc: "8.0",  badge: "LUXURY", fuel: "Petrol"   },
];

const typeCfg = {
  "SUV":      { dotColor: "#f97316", textColor: "#fb923c" },
  "Coupe":    { dotColor: "#ef4444", textColor: "#f87171" },
  "Mini-SUV": { dotColor: "#10b981", textColor: "#34d399" },
  "Sedan":    { dotColor: "#38bdf8", textColor: "#7dd3fc" },
};

const badgeCfg = {
  NEW:    { bg: "bg-emerald-950", text: "text-emerald-400", border: "border-emerald-600/40" },
  HOT:    { bg: "bg-orange-950",  text: "text-orange-400",  border: "border-orange-600/40"  },
  SPORT:  { bg: "bg-red-950",     text: "text-red-400",     border: "border-red-600/40"     },
  ELITE:  { bg: "bg-sky-950",     text: "text-sky-400",     border: "border-sky-600/40"     },
  LUXURY: { bg: "bg-yellow-950",  text: "text-yellow-400",  border: "border-yellow-600/40"  },
};

const TODAY = new Date().toISOString().split("T")[0];

const FONTS = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Rajdhani:wght@400;500;600;700&display=swap');

  input[type="date"]::-webkit-calendar-picker-indicator,
  input[type="time"]::-webkit-calendar-picker-indicator {
    filter: invert(0.5) sepia(1) saturate(3) hue-rotate(345deg);
    cursor: pointer;
  }
  input[type="number"]::-webkit-inner-spin-button,
  input[type="number"]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
  select option { background: #111; color: #fff; }

  @keyframes tdSlideUp { from{opacity:0;transform:translateY(24px) scale(0.97)} to{opacity:1;transform:translateY(0) scale(1)} }
  @keyframes tdPopIn   { from{transform:scale(0);opacity:0} to{transform:scale(1);opacity:1} }
  @keyframes tdFadeUp  { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
  @keyframes tdPulse   { 0%,100%{box-shadow:0 0 0 0 rgba(224,123,42,0.4),0 0 0 8px rgba(224,123,42,0.1)} 50%{box-shadow:0 0 0 8px rgba(224,123,42,0.2),0 0 0 20px rgba(224,123,42,0.05)} }
  @keyframes tdFloat   { 0%{transform:translateY(0) scale(1);opacity:0.7} 100%{transform:translateY(-70px) scale(0);opacity:0} }
  @keyframes tdShimmer { 0%,100%{opacity:0.3;transform:scaleX(1)} 50%{opacity:1;transform:scaleX(1.3)} }
  @keyframes tdHighlight { 0%{box-shadow:0 0 0 0 rgba(224,123,42,0.6)} 70%{box-shadow:0 0 0 12px rgba(224,123,42,0)} 100%{box-shadow:0 0 0 0 rgba(224,123,42,0)} }
`;

function FieldLabel({ children, error }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 9, fontWeight: 700, letterSpacing: "0.25em", textTransform: "uppercase", color: error ? "#ef4444" : "#555", marginBottom: 6 }}>
      {children}
      {error && <span style={{ color: "#ef4444", fontSize: 8 }}>— {error}</span>}
    </div>
  );
}

function TextInput({ value, error, onChange, ...rest }) {
  const base = {
    width: "100%",
    background: error ? "rgba(239,68,68,0.04)" : "rgba(255,255,255,0.03)",
    border: `1px solid ${error ? "rgba(239,68,68,0.45)" : value ? "rgba(224,123,42,0.35)" : "rgba(255,255,255,0.08)"}`,
    color: value ? "#fff" : "#555",
    fontFamily: "'Rajdhani', sans-serif",
    fontSize: 14, fontWeight: 600,
    padding: "10px 12px",
    outline: "none",
    colorScheme: "dark",
    clipPath: "polygon(4px 0%,100% 0%,calc(100% - 4px) 100%,0% 100%)",
    transition: "border-color 0.2s, background 0.2s",
  };
  return (
    <input
      value={value}
      onChange={onChange}
      style={base}
      onFocus={e => { e.target.style.borderColor = "rgba(224,123,42,0.5)"; e.target.style.background = "rgba(224,123,42,0.04)"; }}
      onBlur={e => {
        e.target.style.borderColor = error ? "rgba(239,68,68,0.45)" : value ? "rgba(224,123,42,0.35)" : "rgba(255,255,255,0.08)";
        e.target.style.background = error ? "rgba(239,68,68,0.04)" : "rgba(255,255,255,0.03)";
      }}
      {...rest}
    />
  );
}

function SelectInput({ value, onChange, disabled, error, highlight, children }) {
  return (
    <div style={{ position: "relative" }}>
      <select
        value={value}
        onChange={onChange}
        disabled={disabled}
        style={{
          width: "100%",
          appearance: "none",
          background: highlight ? "rgba(224,123,42,0.08)" : error ? "rgba(239,68,68,0.04)" : "rgba(255,255,255,0.03)",
          border: `1px solid ${highlight ? "rgba(224,123,42,0.6)" : error ? "rgba(239,68,68,0.45)" : value ? "rgba(224,123,42,0.35)" : "rgba(255,255,255,0.08)"}`,
          color: value ? "#fff" : "#555",
          fontFamily: "'Rajdhani', sans-serif",
          fontSize: 14, fontWeight: 600,
          padding: "10px 36px 10px 12px",
          outline: "none",
          cursor: disabled ? "not-allowed" : "pointer",
          opacity: disabled ? 0.4 : 1,
          colorScheme: "dark",
          clipPath: "polygon(4px 0%,100% 0%,calc(100% - 4px) 100%,0% 100%)",
          animation: highlight ? "tdHighlight 0.8s ease-out" : "none",
          transition: "border-color 0.3s, background 0.3s",
        }}
      >
        {children}
      </select>
      <svg style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: highlight ? "#e07b2a" : "#555" }} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </div>
  );
}

function Badge({ badge }) {
  const cfg = badgeCfg[badge] || {};
  return (
    <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", padding: "2px 7px", border: "1px solid" }} className={`${cfg.bg} ${cfg.text} ${cfg.border}`}>
      {badge}
    </span>
  );
}

function AutoFillBadge() {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 8, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#e07b2a", background: "rgba(224,123,42,0.1)", border: "1px solid rgba(224,123,42,0.3)", padding: "2px 8px", marginLeft: 8, animation: "tdFadeUp 0.4s ease both" }}>
      <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
      Auto-filled
    </span>
  );
}

export default function TestDriveBooking({ preselect = null }) {
  const [form, setForm]           = useState({ name: "", age: "", date: "", time: "", brand: "", model: "" });
  const [errors, setErrors]       = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [particles, setParticles] = useState([]);
  const [justAutoFilled, setJustAutoFilled] = useState(false);

  const brands = useMemo(() => [...new Set(allCars.map(c => c.brand))].sort(), []);
  const models = useMemo(() => form.brand ? allCars.filter(c => c.brand === form.brand) : [], [form.brand]);
  const car    = useMemo(() => allCars.find(c => c.brand === form.brand && c.model === form.model), [form.brand, form.model]);

  useEffect(() => {
    if (!preselect?.brand || !preselect?.model) return;

    const exists = allCars.find(c => c.brand === preselect.brand && c.model === preselect.model);
    if (!exists) return;

    setForm(f => ({
      ...f,
      brand: preselect.brand,
      model: preselect.model,
      ...(preselect.date ? { date: preselect.date } : {}),
      ...(preselect.time ? { time: preselect.time } : {}),
    }));
    setErrors(e => ({ ...e, brand: "", model: "", date: "", time: "" }));
    setJustAutoFilled(true);

    const timer = setTimeout(() => setJustAutoFilled(false), 3000);
    return () => clearTimeout(timer);
  }, [preselect?.brand, preselect?.model, preselect?.date, preselect?.time]);

  function set(key) {
    return (e) => {
      const val = e.target.value;
      setForm(f => ({ ...f, [key]: val, ...(key === "brand" ? { model: "" } : {}) }));
      setErrors(er => ({ ...er, [key]: "", ...(key === "brand" ? { model: "" } : {}) }));
      if (key === "brand" || key === "model") setJustAutoFilled(false);
    };
  }

  function validate() {
    const e = {};
    if (!form.name.trim())                            e.name  = "Required";
    if (!form.age || form.age < 18 || form.age > 80) e.age   = "Must be 18–80";
    if (!form.date)                                   e.date  = "Required";
    if (!form.time)                                   e.time  = "Required";
    if (!form.brand)                                  e.brand = "Select a brand";
    if (!form.model)                                  e.model = "Select a model";
    return e;
  }

  function handleSubmit() {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setParticles(Array.from({ length: 12 }, (_, i) => ({
      id: i,
      left:     `${8  + Math.random() * 84}%`,
      bottom:   `${5  + Math.random() * 40}%`,
      size:     3 + Math.random() * 4,
      color:    Math.random() > 0.5 ? "#e07b2a" : "#f59e0b",
      delay:    `${Math.random() * 1.3}s`,
      duration: `${1.4 + Math.random()}s`,
    })));
    setSubmitted(true);
  }

  function handleReset() {
    setSubmitted(false);
    setParticles([]);
    setForm({ name: "", age: "", date: "", time: "", brand: "", model: "" });
    setErrors({});
    setJustAutoFilled(false);
  }

  const wrap = {
    minHeight: "100vh",
    background: "#0c0c0c",
    display: "flex", alignItems: "center", justifyContent: "center",
    padding: "1.5rem",
    fontFamily: "'Rajdhani', sans-serif",
  };

  if (submitted) {
    return (
      <div style={wrap}>
        <style>{FONTS}</style>
        <div style={{ background: "#0f0f0f", border: "1px solid rgba(255,255,255,0.08)", width: "100%", maxWidth: 480, position: "relative", overflow: "hidden", animation: "tdSlideUp 0.35s cubic-bezier(0.16,1,0.3,1) both", display: "flex", flexDirection: "column", alignItems: "center", padding: "48px 28px 40px", textAlign: "center", gap: 14 }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg,transparent,#e07b2a,transparent)" }} />
          {particles.map(p => (
            <div key={p.id} style={{ position: "absolute", borderRadius: "50%", width: p.size, height: p.size, background: p.color, left: p.left, bottom: p.bottom, animation: `tdFloat ${p.duration} ${p.delay} ease-in-out infinite`, pointerEvents: "none" }} />
          ))}
          <div style={{ width: 72, height: 72, borderRadius: "50%", border: "2px solid rgba(224,123,42,0.3)", display: "flex", alignItems: "center", justifyContent: "center", animation: "tdPulse 1.5s ease infinite" }}>
            <svg style={{ animation: "tdPopIn 0.4s cubic-bezier(0.34,1.56,0.64,1) both" }} width="32" height="32" viewBox="0 0 32 32" fill="none">
              <path d="M8 16L13 21L24 10" stroke="#e07b2a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "2.2rem", letterSpacing: "0.08em", color: "#fff", animation: "tdFadeUp 0.5s 0.05s both" }}>TEST DRIVE CONFIRMED</div>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: "#555", animation: "tdFadeUp 0.5s 0.12s both" }}>Congratulations, your session is booked</div>
          {car && (
            <div style={{ animation: "tdFadeUp 0.5s 0.18s both" }}>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.6rem", letterSpacing: "0.06em", color: "#e07b2a" }}>{car.brand} {car.model}</div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginTop: 4, flexWrap: "wrap" }}>
                <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "#555" }}>{form.date}</span>
                <span style={{ color: "#333" }}>·</span>
                <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "#555" }}>{form.time}</span>
                <span style={{ color: "#333" }}>·</span>
                <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "#555" }}>{form.name}</span>
                <span style={{ color: "#333" }}>·</span>
                <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", color: "#555" }}>{car.fuel}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "center", marginTop: 8 }}>
                <Badge badge={car.badge} />
              </div>
            </div>
          )}
          <div style={{ display: "flex", gap: 6, animation: "tdFadeUp 0.5s 0.28s both" }}>
            {[32, 20, 28, 16].map((w, i) => (
              <div key={i} style={{ height: 3, width: w, background: i % 2 === 0 ? "#e07b2a" : "#f59e0b", animation: `tdShimmer 1.2s ${i * 0.15}s ease-in-out infinite` }} />
            ))}
          </div>
          <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", color: "#333", animation: "tdFadeUp 0.5s 0.34s both" }}>Our team will reach you within 24 hours</p>
          <button onClick={handleReset} style={{ marginTop: 6, padding: "10px 32px", background: "transparent", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.4)", fontFamily: "'Rajdhani', sans-serif", fontSize: 9, fontWeight: 700, letterSpacing: "0.28em", textTransform: "uppercase", cursor: "pointer", transition: "all 0.2s", clipPath: "polygon(6px 0%,100% 0%,calc(100% - 6px) 100%,0% 100%)", animation: "tdFadeUp 0.5s 0.48s both" }} onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(224,123,42,0.35)"; e.currentTarget.style.color = "#e07b2a"; }} onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "rgba(255,255,255,0.4)"; }}>
            Book Another →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={wrap}>
      <style>{FONTS}</style>
      <div style={{ width: "100%", maxWidth: 520, animation: "tdSlideUp 0.35s cubic-bezier(0.16,1,0.3,1) both" }}>
        <div style={{ background: "#0f0f0f", border: "1px solid rgba(255,255,255,0.08)", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg,transparent,#e07b2a,transparent)" }} />

          <div style={{ padding: "22px 24px 18px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
            <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", color: "#e07b2a", marginBottom: 6, display: "flex", alignItems: "center" }}>
              Schedule Test Drive
              {justAutoFilled && <AutoFillBadge />}
            </p>
            {car ? (
              <>
                <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(1.6rem,5vw,2.4rem)", letterSpacing: "0.06em", color: "#fff", lineHeight: 1 }}>
                  <span style={{ color: "#e07b2a" }}>{car.brand}</span>{" "}{car.model}
                </h1>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 8, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", color: "#e07b2a" }}>{car.price}</span>
                  <span style={{ color: "rgba(255,255,255,0.1)" }}>|</span>
                  <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: typeCfg[car.type]?.dotColor, display: "inline-block" }} />
                    <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: typeCfg[car.type]?.textColor }}>{car.type}</span>
                  </span>
                  <span style={{ color: "rgba(255,255,255,0.1)" }}>|</span>
                  <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.15em", color: "#444" }}>{car.hp}</span>
                  <span style={{ color: "rgba(255,255,255,0.1)" }}>|</span>
                  <Badge badge={car.badge} />
                  <span style={{ color: "rgba(255,255,255,0.1)" }}>|</span>
                  <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.12em", color: "#555" }}>{car.fuel}</span>
                </div>
              </>
            ) : (
              <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(1.6rem,5vw,2.4rem)", letterSpacing: "0.06em", color: "rgba(255,255,255,0.12)", lineHeight: 1 }}>Select a Vehicle</h1>
            )}
          </div>

          <div style={{ padding: "22px 24px", display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <FieldLabel error={errors.name}>Full Name</FieldLabel>
              <TextInput type="text" placeholder="Enter your full name" value={form.name} onChange={set("name")} error={errors.name} />
            </div>
            <div>
              <FieldLabel error={errors.age}>Age</FieldLabel>
              <TextInput type="number" placeholder="18 – 80" min={18} max={80} value={form.age} onChange={set("age")} error={errors.age} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <FieldLabel error={errors.date}>Scheduled Date</FieldLabel>
                <TextInput type="date" min={TODAY} value={form.date} onChange={set("date")} error={errors.date} />
              </div>
              <div>
                <FieldLabel error={errors.time}>Scheduled Time</FieldLabel>
                <TextInput type="time" value={form.time} onChange={set("time")} error={errors.time} />
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.05)" }} />
              <span style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.25em", textTransform: "uppercase", color: "#2a2a2a" }}>Vehicle Selection</span>
              <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.05)" }} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <FieldLabel error={errors.brand}>Car Brand</FieldLabel>
                <SelectInput value={form.brand} error={errors.brand} highlight={justAutoFilled && !!form.brand} onChange={e => { setForm(f => ({ ...f, brand: e.target.value, model: "" })); setErrors(er => ({ ...er, brand: "", model: "" })); setJustAutoFilled(false); }}>
                  <option value="">Select brand</option>
                  {brands.map(b => <option key={b} value={b}>{b}</option>)}
                </SelectInput>
              </div>
              <div>
                <FieldLabel error={errors.model}>Car Model</FieldLabel>
                <SelectInput value={form.model} error={errors.model} highlight={justAutoFilled && !!form.model} onChange={set("model")} disabled={!form.brand}>
                  <option value="">{form.brand ? "Select model" : "Choose brand first"}</option>
                  {models.map(c => <option key={c.id} value={c.model}>{c.model}</option>)}
                </SelectInput>
              </div>
            </div>
          </div>

          <div style={{ padding: "0 24px 24px" }}>
            <div style={{ height: 1, background: "rgba(255,255,255,0.04)", marginBottom: 16 }} />
            <button onClick={handleSubmit} style={{ position: "relative", overflow: "hidden", width: "100%", padding: "14px", background: "transparent", border: "1px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.8)", fontFamily: "'Rajdhani', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.25em", textTransform: "uppercase", cursor: "pointer", clipPath: "polygon(8px 0%,100% 0%,calc(100% - 8px) 100%,0% 100%)", transition: "color 0.3s, border-color 0.3s" }} onMouseEnter={e => { e.currentTarget.querySelector(".td-fill").style.transform = "translateX(0)"; e.currentTarget.style.color = "#000"; e.currentTarget.style.borderColor = "#e07b2a"; }} onMouseLeave={e => { e.currentTarget.querySelector(".td-fill").style.transform = "translateX(-101%)"; e.currentTarget.style.color = "rgba(255,255,255,0.8)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)"; }}>
              <div className="td-fill" style={{ position: "absolute", inset: 0, background: "#e07b2a", transform: "translateX(-101%)", transition: "transform 0.3s ease", pointerEvents: "none" }} />
              <span style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
                Confirm Test Drive
                <svg width="13" height="11" viewBox="0 0 13 11" fill="none"><path d="M1 5.5H12M7.5 1L12 5.5L7.5 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </span>
            </button>
          </div>
        </div>
        <p style={{ textAlign: "center", fontSize: 9, fontWeight: 700, letterSpacing: "0.28em", textTransform: "uppercase", color: "#222", marginTop: 16 }}>AutoBharat · Test Drive Program</p>
      </div>
    </div>
  );
}