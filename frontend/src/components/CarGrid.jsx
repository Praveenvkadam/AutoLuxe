import { useState, useEffect, useRef } from "react";

const allCars = [
  { id: 1, type: "SUV",      brand: "Lamborghini",  model: "Urus S",            price: "$248,000", year: 2024, hp: "666 HP",  speed: "305", acc: "3.5", image: "https://images.unsplash.com/photo-1621135802920-133df287f89c?w=800&q=80", badge: "NEW",    fuel: "Petrol"   },
  { id: 2, type: "SUV",      brand: "Bentley",       model: "Bentayga EWB",      price: "$310,000", year: 2024, hp: "542 HP",  speed: "290", acc: "4.5", image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&q=80", badge: "LUXURY", fuel: "Hybrid"   },
  { id: 3, type: "Coupe",    brand: "Porsche",       model: "911 Turbo S",       price: "$216,000", year: 2024, hp: "650 HP",  speed: "330", acc: "2.7", image: "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=800&q=80", badge: "HOT",    fuel: "Petrol"   },
  { id: 4, type: "Coupe",    brand: "Ferrari",       model: "F8 Tributo",        price: "$280,000", year: 2023, hp: "710 HP",  speed: "340", acc: "2.9", image: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&q=80", badge: "RARE",   fuel: "Petrol"   },
  { id: 5, type: "Mini-SUV", brand: "Porsche",       model: "Macan GTS",         price: "$92,000",  year: 2024, hp: "440 HP",  speed: "272", acc: "4.3", image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80", badge: "NEW",    fuel: "Electric" },
  { id: 6, type: "Mini-SUV", brand: "Bugatti",       model: "Chiron",            price: "$239,000", year: 2024, hp: "707 HP",  speed: "310", acc: "3.3", image: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&q=80", badge: "SPORT",  fuel: "Petrol"   },
  { id: 7, type: "Sedan",    brand: "Mercedes",      model: "AMG GT 63 S",       price: "$175,000", year: 2024, hp: "630 HP",  speed: "315", acc: "3.2", image: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=800&q=80", badge: "ELITE",  fuel: "Petrol"   },
  { id: 8, type: "Sedan",    brand: "Rolls-Royce",   model: "Ghost Black Badge", price: "$420,000", year: 2024, hp: "592 HP",  speed: "280", acc: "4.8", image: "https://images.unsplash.com/photo-1563720223185-11003d516935?w=800&q=80", badge: "LUXURY", fuel: "Petrol"   },
];

const typeMap = {
  "All Types": null,
  "SUV":       "SUV",
  "Mini-SUV":  "Mini-SUV",
  "Coupe":     "Coupe",
  "Sedan":     "Sedan",
};

const priceMap = {
  "Any Price":       [0, Infinity],
  "Under $50K":      [0, 50000],
  "$50K – $100K":    [50000, 100000],
  "$100K – $200K":   [100000, 200000],
  "$200K – $500K":   [200000, 500000],
  "$500K+":          [500000, Infinity],
};

function parsePrice(str) {
  return parseInt(str.replace(/[$,]/g, ""), 10);
}

function formatDate(date) {
  return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

const badgeCfg = {
  NEW:    { bg: "bg-emerald-950", text: "text-emerald-400", border: "border-emerald-600/40" },
  HOT:    { bg: "bg-orange-950",  text: "text-orange-400",  border: "border-orange-600/40"  },
  RARE:   { bg: "bg-purple-950",  text: "text-purple-400",  border: "border-purple-600/40"  },
  LUXURY: { bg: "bg-yellow-950",  text: "text-yellow-400",  border: "border-yellow-600/40"  },
  SPORT:  { bg: "bg-red-950",     text: "text-red-400",     border: "border-red-600/40"     },
  ELITE:  { bg: "bg-sky-950",     text: "text-sky-400",     border: "border-sky-600/40"     },
};

const typeCfg = {
  "SUV":      { dot: "bg-orange-500",  text: "text-orange-400"  },
  "Coupe":    { dot: "bg-red-500",     text: "text-red-400"     },
  "Mini-SUV": { dot: "bg-emerald-500", text: "text-emerald-400" },
  "Sedan":    { dot: "bg-sky-500",     text: "text-sky-400"     },
};

/* ── Booking Modal ───────────────────────────────────────────── */
function BookingModal({ car, onClose }) {
  const [form, setForm]         = useState({ name: "", address: "", contact: "" });
  const [errors, setErrors]     = useState({});
  const [shaking, setShaking]   = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [particles, setParticles] = useState([]);
  const overlayRef = useRef(null);

  // Trap scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  // Dismiss on overlay click
  function handleOverlayClick(e) {
    if (e.target === overlayRef.current) onClose();
  }

  function validate() {
    const errs = {};
    if (!form.name.trim())    errs.name    = true;
    if (!form.address.trim()) errs.address = true;
    if (!form.contact.trim()) errs.contact = true;
    return errs;
  }

  function handleSubmit() {
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      setShaking(errs);
      setTimeout(() => setShaking({}), 450);
      return;
    }

    // Generate floating particles
    setParticles(
      Array.from({ length: 10 }, (_, i) => ({
        id: i,
        left: `${10 + Math.random() * 80}%`,
        bottom: `${5 + Math.random() * 35}%`,
        size: 3 + Math.random() * 4,
        color: Math.random() > 0.5 ? "#e07b2a" : "#f59e0b",
        delay: `${Math.random() * 1.2}s`,
        duration: `${1.5 + Math.random()}s`,
      }))
    );
    setSubmitted(true);
  }

  const inputBase =
    "w-full bg-white/[0.03] border text-white placeholder-white/20 px-3 py-2.5 text-sm font-semibold outline-none transition-all duration-200 focus:bg-orange-500/[0.04]";

  const inputStyle = (key) =>
    `${inputBase} ${
      shaking[key]  ? "animate-shake border-red-500/50" :
      errors[key]   ? "border-red-500/30"               :
      form[key]     ? "border-orange-500/30"             :
                      "border-white/[0.08] focus:border-orange-500/40"
    }`;

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      style={{
        position: "fixed", inset: 0,
        background: "rgba(0,0,0,0.85)",
        backdropFilter: "blur(6px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 9999, padding: "1rem",
        animation: "bmFadeIn 0.25s ease both",
        fontFamily: "'Rajdhani', sans-serif",
      }}
    >
      <style>{`
        @keyframes bmFadeIn  { from { opacity: 0 } to { opacity: 1 } }
        @keyframes bmSlideUp { from { opacity: 0; transform: translateY(28px) scale(0.97) } to { opacity: 1; transform: translateY(0) scale(1) } }
        @keyframes bmShake   { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-6px)} 40%{transform:translateX(6px)} 60%{transform:translateX(-4px)} 80%{transform:translateX(4px)} }
        @keyframes bmPopIn   { from { transform: scale(0); opacity: 0 } to { transform: scale(1); opacity: 1 } }
        @keyframes bmFadeUp  { from { opacity: 0; transform: translateY(10px) } to { opacity: 1; transform: translateY(0) } }
        @keyframes bmPulse   { 0%,100%{box-shadow:0 0 0 0 rgba(224,123,42,0.4),0 0 0 8px rgba(224,123,42,0.1)} 50%{box-shadow:0 0 0 8px rgba(224,123,42,0.2),0 0 0 20px rgba(224,123,42,0.05)} }
        @keyframes bmFloat   { 0%{transform:translateY(0) scale(1);opacity:0.7} 100%{transform:translateY(-60px) scale(0);opacity:0} }
        @keyframes bmShimmer { 0%,100%{opacity:0.3;transform:scaleX(1)} 50%{opacity:1;transform:scaleX(1.3)} }
        .bm-shake { animation: bmShake 0.4s ease !important; }
      `}</style>

      {/* Modal shell */}
      <div
        style={{
          background: "#0f0f0f",
          border: "1px solid rgba(255,255,255,0.08)",
          width: "100%", maxWidth: 480,
          position: "relative", overflow: "hidden",
          animation: "bmSlideUp 0.35s cubic-bezier(0.16,1,0.3,1) both",
        }}
      >
        {/* Top accent */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg,transparent,#e07b2a,transparent)" }} />

        {/* Floating particles (success only) */}
        {particles.map((p) => (
          <div
            key={p.id}
            style={{
              position: "absolute", borderRadius: "50%",
              width: p.size, height: p.size, background: p.color,
              left: p.left, bottom: p.bottom,
              animation: `bmFloat ${p.duration} ${p.delay} ease-in-out infinite`,
              pointerEvents: "none",
            }}
          />
        ))}

        {/* Close button */}
        {!submitted && (
          <button
            onClick={onClose}
            style={{
              position: "absolute", top: 12, right: 12,
              width: 28, height: 28,
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "rgba(255,255,255,0.45)",
              cursor: "pointer", fontSize: 13,
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all 0.2s",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(224,123,42,0.15)"; e.currentTarget.style.borderColor = "rgba(224,123,42,0.4)"; e.currentTarget.style.color = "#e07b2a"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "rgba(255,255,255,0.45)"; }}
          >✕</button>
        )}

        {/* ── FORM VIEW ── */}
        {!submitted && (
          <>
            {/* Car info strip */}
            <div style={{ padding: "20px 22px 16px", borderBottom: "1px solid rgba(255,255,255,0.05)", background: "rgba(255,255,255,0.02)" }}>
              <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.28em", textTransform: "uppercase", color: "#555", marginBottom: 6 }}>
                Booking for
              </p>
              <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "2rem", letterSpacing: "0.06em", color: "#fff", lineHeight: 1 }}>
                <span style={{ color: "#e07b2a" }}>{car.brand}</span>{" "}{car.model}
              </h2>
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 10 }}>
                <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.2rem", letterSpacing: "0.05em", color: "#e07b2a" }}>
                  {car.price}
                </span>
                <span style={{ fontSize: 9, fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: "#444", borderLeft: "1px solid rgba(255,255,255,0.08)", paddingLeft: 16 }}>
                  {formatDate(new Date())}
                </span>
              </div>
            </div>

            {/* Form fields */}
            <div style={{ padding: "20px 22px", display: "flex", flexDirection: "column", gap: 14 }}>
              {[
                { key: "name",    label: "Full Name",       placeholder: "Enter your full name",       type: "text" },
                { key: "address", label: "Address",         placeholder: "Enter your delivery address", type: "text" },
                { key: "contact", label: "Contact Number",  placeholder: "+91 00000 00000",            type: "tel"  },
              ].map(({ key, label, placeholder, type }) => (
                <div key={key}>
                  <label style={{ display: "block", fontSize: 9, fontWeight: 700, letterSpacing: "0.25em", textTransform: "uppercase", color: errors[key] ? "#ef4444" : "#555", marginBottom: 5 }}>
                    {label}{errors[key] && <span style={{ color: "#ef4444", marginLeft: 6 }}>required</span>}
                  </label>
                  <input
                    type={type}
                    placeholder={placeholder}
                    value={form[key]}
                    onChange={e => {
                      setForm(f => ({ ...f, [key]: e.target.value }));
                      if (errors[key]) setErrors(er => ({ ...er, [key]: false }));
                    }}
                    className={shaking[key] ? "bm-shake" : ""}
                    style={{
                      width: "100%",
                      background: errors[key] ? "rgba(239,68,68,0.04)" : "rgba(255,255,255,0.03)",
                      border: `1px solid ${errors[key] ? "rgba(239,68,68,0.45)" : form[key] ? "rgba(224,123,42,0.35)" : "rgba(255,255,255,0.08)"}`,
                      color: "#fff",
                      fontFamily: "'Rajdhani', sans-serif",
                      fontSize: 14, fontWeight: 600,
                      padding: "10px 12px",
                      outline: "none",
                      transition: "border-color 0.2s, background 0.2s",
                      clipPath: "polygon(4px 0%,100% 0%,calc(100% - 4px) 100%,0% 100%)",
                    }}
                    onFocus={e => { e.target.style.borderColor = "rgba(224,123,42,0.4)"; e.target.style.background = "rgba(224,123,42,0.04)"; }}
                    onBlur={e => {
                      if (!form[key]) {
                        e.target.style.borderColor = errors[key] ? "rgba(239,68,68,0.45)" : "rgba(255,255,255,0.08)";
                        e.target.style.background = errors[key] ? "rgba(239,68,68,0.04)" : "rgba(255,255,255,0.03)";
                      }
                    }}
                  />
                </div>
              ))}

              <div style={{ height: 1, background: "rgba(255,255,255,0.04)" }} />

              {/* Submit button */}
              <button
                onClick={handleSubmit}
                style={{
                  position: "relative", overflow: "hidden",
                  width: "100%", padding: "13px",
                  background: "transparent",
                  border: "1px solid rgba(255,255,255,0.15)",
                  color: "rgba(255,255,255,0.8)",
                  fontFamily: "'Rajdhani', sans-serif",
                  fontSize: 11, fontWeight: 700, letterSpacing: "0.25em",
                  textTransform: "uppercase", cursor: "pointer",
                  clipPath: "polygon(6px 0%,100% 0%,calc(100% - 6px) 100%,0% 100%)",
                  transition: "color 0.3s, border-color 0.3s",
                }}
                onMouseEnter={e => {
                  e.currentTarget.querySelector(".bm-fill").style.transform = "translateX(0)";
                  e.currentTarget.style.color = "#000";
                  e.currentTarget.style.borderColor = "#e07b2a";
                }}
                onMouseLeave={e => {
                  e.currentTarget.querySelector(".bm-fill").style.transform = "translateX(-101%)";
                  e.currentTarget.style.color = "rgba(255,255,255,0.8)";
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)";
                }}
              >
                <div className="bm-fill" style={{ position: "absolute", inset: 0, background: "#e07b2a", transform: "translateX(-101%)", transition: "transform 0.3s ease", pointerEvents: "none" }} />
                <span style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                  Confirm Booking
                  <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
                    <path d="M1 5H11M7 1L11 5L7 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
              </button>
            </div>
          </>
        )}

        {/* ── SUCCESS VIEW ── */}
        {submitted && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "44px 24px 40px", textAlign: "center", gap: 14 }}>

            {/* Pulsing check circle */}
            <div style={{
              width: 72, height: 72, borderRadius: "50%",
              border: "2px solid rgba(224,123,42,0.3)",
              display: "flex", alignItems: "center", justifyContent: "center",
              animation: "bmPulse 1.5s ease infinite",
            }}>
              <svg style={{ animation: "bmPopIn 0.4s cubic-bezier(0.34,1.56,0.64,1) both" }} width="32" height="32" viewBox="0 0 32 32" fill="none">
                <path d="M8 16L13 21L24 10" stroke="#e07b2a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>

            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "2.2rem", letterSpacing: "0.08em", color: "#fff", animation: "bmFadeUp 0.5s 0.05s both" }}>
              BOOKING CONFIRMED
            </div>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: "#555", animation: "bmFadeUp 0.5s 0.15s both" }}>
              Congratulations! Your ride awaits
            </div>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.5rem", letterSpacing: "0.06em", color: "#e07b2a", animation: "bmFadeUp 0.5s 0.2s both" }}>
              {car.brand} {car.model}
            </div>

            {/* Shimmer bars */}
            <div style={{ display: "flex", gap: 6, animation: "bmFadeUp 0.5s 0.3s both" }}>
              {[32, 20, 28, 16].map((w, i) => (
                <div key={i} style={{ height: 3, width: w, background: i % 2 === 0 ? "#e07b2a" : "#f59e0b", animation: `bmShimmer 1.2s ${i * 0.15}s ease-in-out infinite` }} />
              ))}
            </div>

            <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", color: "#333", marginTop: 2, animation: "bmFadeUp 0.5s 0.35s both" }}>
              Our team will contact you within 24 hours
            </p>

            <button
              onClick={onClose}
              style={{
                marginTop: 6, padding: "10px 32px",
                background: "transparent", border: "1px solid rgba(255,255,255,0.1)",
                color: "rgba(255,255,255,0.4)",
                fontFamily: "'Rajdhani', sans-serif",
                fontSize: 9, fontWeight: 700, letterSpacing: "0.28em", textTransform: "uppercase",
                cursor: "pointer", transition: "all 0.2s",
                clipPath: "polygon(6px 0%,100% 0%,calc(100% - 6px) 100%,0% 100%)",
                animation: "bmFadeUp 0.5s 0.5s both",
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(224,123,42,0.3)"; e.currentTarget.style.color = "#e07b2a"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "rgba(255,255,255,0.4)"; }}
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── CarCard ─────────────────────────────────────────────────── */
function CarCard({ car, visible, onBook }) {
  return (
    <div
      className="group relative flex flex-col overflow-hidden bg-[#0f0f0f] border border-white/[0.07]
        hover:border-orange-500/40 hover:-translate-y-1.5
        hover:shadow-[0_32px_64px_rgba(0,0,0,0.7),0_0_0_1px_rgba(224,123,42,0.12)]"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0) scale(1)" : "translateY(24px) scale(0.97)",
        transition: "opacity 0.4s ease, transform 0.4s ease, border-color 0.3s, box-shadow 0.3s",
        fontFamily: "'Rajdhani', sans-serif",
      }}
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden bg-black">
        <img
          src={car.image}
          alt={`${car.brand} ${car.model}`}
          className="w-full h-full object-cover opacity-75 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] via-[#0f0f0f]/20 to-transparent" />

        {/* Type + Badge */}
        <div className="absolute top-0 left-0 right-0 flex items-start justify-between p-3">
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-black/70 backdrop-blur-md border border-white/10">
            <span className={`w-1.5 h-1.5 rounded-full ${typeCfg[car.type].dot}`} />
            <span className={`text-[9px] font-bold tracking-[0.22em] uppercase ${typeCfg[car.type].text}`}>{car.type}</span>
          </div>
          {(() => {
            const b = badgeCfg[car.badge];
            return (
              <span className={`text-[9px] font-bold tracking-[0.22em] uppercase px-2.5 py-1 border ${b.bg} ${b.text} ${b.border}`}>
                {car.badge}
              </span>
            );
          })()}
        </div>

        <div className="absolute bottom-3 left-3">
          <span className="text-[9px] tracking-widest text-white/40 uppercase font-semibold border border-white/10 px-2 py-0.5 bg-black/50 backdrop-blur-sm">
            {car.fuel}
          </span>
        </div>
        <div className="absolute bottom-3 right-3">
          <span className="text-[9px] tracking-widest text-white/30 font-semibold">{car.year}</span>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-4 gap-3.5">
        <div>
          <p className="text-[9px] font-bold tracking-[0.28em] uppercase text-gray-600 mb-1">{car.brand}</p>
          <h3
            className="text-[1.35rem] font-bold leading-none text-white group-hover:text-orange-400 transition-colors duration-300"
            style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.05em" }}
          >
            {car.model}
          </h3>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 divide-x divide-white/[0.06] border border-white/[0.06]">
          {[
            { label: "0–100 KM/H", value: car.acc,   unit: "S"     },
            { label: "Max Power",  value: car.hp,     unit: ""       },
            { label: "Top Speed",  value: car.speed,  unit: "KM/H"  },
          ].map(({ label, value, unit }) => (
            <div key={label} className="flex flex-col items-center py-2.5 px-1 gap-0.5">
              <span className="text-orange-500 text-sm font-bold leading-none" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                {value}<span className="text-[10px] text-orange-400/60 ml-0.5">{unit}</span>
              </span>
              <span className="text-[8px] text-gray-600 tracking-widest uppercase text-center leading-tight mt-0.5">{label}</span>
            </div>
          ))}
        </div>

        <div className="h-px w-full bg-white/[0.05]" />

        {/* Price + CTA */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[8px] text-gray-600 tracking-widest uppercase mb-0.5">Starting from</p>
            <p className="text-white text-xl leading-none font-bold" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.04em" }}>
              {car.price}
            </p>
          </div>
          <button
            onClick={() => onBook(car)}
            className="relative overflow-hidden flex items-center gap-2 px-4 py-2 text-[9px] font-bold tracking-[0.2em] uppercase border border-white/20 text-white/80
              before:absolute before:inset-0 before:bg-orange-500 before:translate-x-[-101%] before:transition-transform before:duration-300
              hover:before:translate-x-0 hover:text-black hover:border-orange-500 transition-colors duration-300"
            style={{ clipPath: "polygon(6px 0%,100% 0%,calc(100% - 6px) 100%,0% 100%)" }}
          >
            <span className="relative z-10 flex items-center gap-2">
              Book
              <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                <path d="M1 4H9M6 1L9 4L6 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </button>
        </div>
      </div>

      {/* Bottom accent */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-orange-500 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center" />
    </div>
  );
}

/* ── Grid ────────────────────────────────────────────────────── */
export default function CarGrid({ filters, searchVal }) {
  const [displayedCars, setDisplayedCars] = useState(allCars);
  const [visibleMap, setVisibleMap]       = useState({});
  const [bookingCar, setBookingCar]       = useState(null); // ← which car is being booked
  const prevFilters = useRef(null);

  function applyFilters(f, search) {
    return allCars.filter((car) => {
      if (f.brand !== "All Brands" && car.brand !== f.brand) return false;
      const mappedType = typeMap[f.carType];
      if (mappedType && car.type !== mappedType) return false;
      const [min, max] = priceMap[f.priceRange] ?? [0, Infinity];
      if (parsePrice(car.price) < min || parsePrice(car.price) > max) return false;
      if (search) {
        const q = search.toLowerCase();
        if (!car.brand.toLowerCase().includes(q) && !car.model.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }

  useEffect(() => {
    const next = applyFilters(filters, searchVal);
    const same = JSON.stringify(prevFilters.current) === JSON.stringify({ filters, searchVal });
    if (same) return;
    prevFilters.current = { filters, searchVal };
    setVisibleMap({});
    setTimeout(() => {
      setDisplayedCars(next);
      setTimeout(() => {
        next.forEach((car, i) => {
          setTimeout(() => {
            setVisibleMap((prev) => ({ ...prev, [car.id]: true }));
          }, i * 75);
        });
      }, 60);
    }, 300);
  }, [filters, searchVal]);

  useEffect(() => {
    allCars.forEach((car, i) => {
      setTimeout(() => {
        setVisibleMap((prev) => ({ ...prev, [car.id]: true }));
      }, 120 + i * 80);
    });
    prevFilters.current = { filters, searchVal };
  }, []);

  const isFiltered =
    filters.brand !== "All Brands"   ||
    filters.carType !== "All Types"   ||
    filters.priceRange !== "Any Price" ||
    searchVal.trim() !== "";

  return (
    <>
      {/* Booking Modal — rendered at top level so it overlays everything */}
      {bookingCar && (
        <BookingModal car={bookingCar} onClose={() => setBookingCar(null)} />
      )}

      <section className="bg-[#0c0c0c] px-5 py-16 relative overflow-hidden" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] pointer-events-none"
          style={{ background: "radial-gradient(ellipse at center top, rgba(224,123,42,0.04) 0%, transparent 70%)" }} />

        <div className="max-w-7xl mx-auto relative">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="w-8 h-px bg-orange-500 block" />
                <span className="text-orange-500 text-[10px] font-bold tracking-[0.28em] uppercase">Our Collection</span>
              </div>
              <h2 className="leading-none text-white" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2rem,5vw,3rem)", letterSpacing: "0.07em" }}>
                FEATURED <span className="text-orange-500">VEHICLES</span>
              </h2>
              <p className="text-gray-600 text-[10px] tracking-[0.2em] uppercase mt-2">
                <span className="text-white font-bold transition-all duration-300" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1rem" }}>
                  {displayedCars.length}
                </span>
                &nbsp;vehicle{displayedCars.length !== 1 ? "s" : ""} {isFiltered ? "matched" : "available"}
              </p>
            </div>

            {isFiltered && (
              <div className="flex items-center gap-2 flex-wrap">
                {[
                  filters.brand !== "All Brands"    && filters.brand,
                  filters.carType !== "All Types"    && filters.carType,
                  filters.priceRange !== "Any Price" && filters.priceRange,
                  searchVal.trim() !== ""             && `"${searchVal}"`,
                ].filter(Boolean).map((tag) => (
                  <span key={tag} className="text-[9px] font-bold tracking-widest uppercase px-2.5 py-1 border border-orange-500/30 bg-orange-500/10 text-orange-400">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-8">
            <div className="h-px flex-1 bg-white/[0.05]" />
            <span className="text-[8px] text-gray-700 tracking-[0.3em] uppercase">
              {isFiltered ? "Filtered Results" : "All Vehicles"}
            </span>
            <div className="h-px flex-1 bg-white/[0.05]" />
          </div>

          {/* Grid */}
          {displayedCars.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 gap-3">
              <span className="text-4xl text-gray-800" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>NO RESULTS</span>
              <p className="text-gray-600 text-xs tracking-widest uppercase">Try adjusting your filters above</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {displayedCars.map((car) => (
                <CarCard
                  key={car.id}
                  car={car}
                  visible={!!visibleMap[car.id]}
                  onBook={setBookingCar}     // ← pass setter down
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}