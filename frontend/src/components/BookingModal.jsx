import { useState, useEffect, useRef } from "react";
import { formatDate } from "../utils/carUtils";

export default function BookingModal({ car, onClose }) {
  const [form, setForm]         = useState({ name: "", address: "", contact: "" });
  const [errors, setErrors]     = useState({});
  const [shaking, setShaking]   = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [particles, setParticles] = useState([]);
  const overlayRef = useRef(null);


  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  
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

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
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

      <div
        style={{
          background: "#0f0f0f",
          border: "1px solid rgba(255,255,255,0.08)",
          width: "100%", maxWidth: 480,
          position: "relative", overflow: "hidden",
          animation: "bmSlideUp 0.35s cubic-bezier(0.16,1,0.3,1) both",
        }}
      >
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg,transparent,#e07b2a,transparent)" }} />

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

        {!submitted && (
          <button
            onClick={onClose}
            aria-label="Close modal"
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

        {!submitted && (
          <>
            <div style={{ padding: "20px 22px 16px", borderBottom: "1px solid rgba(255,255,255,0.05)", background: "rgba(255,255,255,0.02)" }}>
              <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.28em", textTransform: "uppercase", color: "#555", marginBottom: 6 }}>
                Booking for
              </p>
              <h2 id="modal-title" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "2rem", letterSpacing: "0.06em", color: "#fff", lineHeight: 1 }}>
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

        {submitted && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "44px 24px 40px", textAlign: "center", gap: 14 }}>
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
