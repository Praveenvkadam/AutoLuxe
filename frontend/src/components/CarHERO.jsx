import { useState, useEffect, useRef } from "react";

const slides = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=1600&q=80&auto=format&fit=crop",
    badge: "New Arrival 2025",
    title: "PURE\nDRIVING\nPLEASURE",
    subtitle: "Where every curve tells a story. Engineered for those who feel the road.",
    specs: [
      { label: "0–100 km/h", value: "3.4s" },
      { label: "Max Power",  value: "630hp" },
      { label: "Top Speed",  value: "320km/h" },
    ],
    accent: "#e63946",
    type: "intro",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1600&q=80&auto=format&fit=crop",
    badge: "Experience It Live",
    title: "FEEL THE\nDIFFERENCE\nFIRSTHAND",
    subtitle: "Reserve your seat behind the wheel. A 30-minute test drive that changes everything.",
    cta: "Book a Test Drive",
    ctaIcon: "→",
    accent: "#f4a261",
    type: "testdrive",
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=1600&q=80&auto=format&fit=crop",
    badge: "Find Your Match",
    title: "CHOOSE\nYOUR\nPERFECT\nRIDE",
    subtitle: "Side-by-side specs, features and performance. Find the car built for your life.",
    cta: "Compare Models",
    ctaIcon: "⇌",
    accent: "#2ec4b6",
    type: "compare",
  },
];

// Minimal CSS kept only for things Tailwind cannot express:
// 1. Pseudo-elements (::after, ::before)
// 2. clip-path
// 3. Staggered transition-delays + custom cubic-bezier
const minimalCss = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Outfit:wght@300;400;600&display=swap');

  /* Gradient overlay on background image */
  .ch-bg::after {
    content: '';
    position: absolute; inset: 0;
    background: linear-gradient(108deg, rgba(0,0,0,.88) 0%, rgba(0,0,0,.52) 42%, rgba(0,0,0,.08) 100%);
  }

  /* Diagonal cut at bottom of each slide */
  .ch-cut { clip-path: polygon(0 58%, 100% 0%, 100% 100%, 0 100%); }

  /* CTA hover fill (slide-in from left) */
  .ch-cta::before {
    content: '';
    position: absolute; inset: 0;
    background: var(--accent);
    transform: translateX(-101%);
    transition: transform .38s cubic-bezier(.4,0,.2,1);
    z-index: 0;
  }
  .ch-cta:hover::before  { transform: translateX(0); }
  .ch-cta:hover .ch-icon { transform: translateX(5px); }

  /* Slide-entrance: hidden by default, revealed when slide is active */
  .ch-anim         { opacity: 0; transform: translateY(18px); }
  .active .ch-anim { opacity: 1; transform: translateY(0);    }

  /* Staggered delays per element */
  .ch-d1 { transition: opacity .50s ease  .10s, transform .50s ease  .10s; }
  .ch-d2 { transition: opacity .65s ease  .22s, transform .65s ease  .22s; }
  .ch-d3 { transition: opacity .50s ease  .36s, transform .50s ease  .36s; }
  .ch-d4 { transition: opacity .50s ease  .46s, transform .50s ease  .46s; }

  /* Slide track: custom cubic-bezier unavailable in Tailwind */
  .ch-track { transition: transform .88s cubic-bezier(.77,0,.18,1); }

  @media (max-width: 680px) {
    .ch-counter { display: none; }
    .ch-cut     { height: 70px; }
    .ch-content { padding: 0 24px !important; padding-top: 96px !important; }
  }
`;

const DURATION = 5200;

export default function CarHero({ onAccentChange }) {
  const [cur, setCur]   = useState(0);
  const [prog, setProg] = useState(0);
  const startRef = useRef(performance.now());
  const rafRef   = useRef(null);

  const goTo = (idx) => {
    setCur(idx);
    setProg(0);
    startRef.current = performance.now();
  };

  useEffect(() => {
    if (onAccentChange) onAccentChange(slides[cur].accent);
  }, [cur]);

  useEffect(() => {
    startRef.current = performance.now();
    const tick = (now) => {
      const elapsed = now - startRef.current;
      const p = Math.min((elapsed / DURATION) * 100, 100);
      setProg(p);
      if (elapsed >= DURATION) {
        setCur((c) => (c + 1) % slides.length);
        startRef.current = performance.now();
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [cur]);

  const sl = slides[cur];

  return (
    <>
      <style>{minimalCss}</style>

      <section
        className="relative w-full overflow-hidden"
        style={{
          height: "100vh",
          minHeight: "580px",
          background: "#0a0a0a",
          fontFamily: "'Outfit', sans-serif",
          "--accent": sl.accent,
        }}
      >
        {/* ── Top progress bar ── */}
        <div
          className="absolute top-0 left-0 h-0.5 z-20"
          style={{ width: `${prog}%`, background: sl.accent, transition: "width .1s linear" }}
        />

        {/* ── Slides track ── */}
        <div
          className="ch-track flex h-full will-change-transform"
          style={{ transform: `translateX(-${cur * 100}%)` }}
        >
          {slides.map((s, i) => (
            <div
              key={s.id}
              className={`ch-slide flex-none w-full h-full relative overflow-hidden${i === cur ? " active" : ""}`}
              style={{ "--accent": s.accent }}
            >
              {/* Background image */}
              <div
                className="ch-bg absolute inset-0 bg-cover"
                style={{ backgroundImage: `url(${s.image})`, backgroundPosition: "center 30%" }}
              />

              {/* Content */}
              <div
                className="ch-content relative z-[4] h-full flex flex-col justify-center"
                style={{ padding: "0 7vw", paddingTop: "90px" }}
              >
                {/* Badge */}
                <div
                  className="ch-anim ch-d1 inline-flex items-center gap-2 mb-[18px]"
                  style={{
                    fontSize: "10px", fontWeight: 600,
                    letterSpacing: "0.2em", textTransform: "uppercase", color: "#fff",
                  }}
                >
                  <span className="w-7 h-[1.5px] rounded-full" style={{ background: s.accent }} />
                  {s.badge}
                </div>

                {/* Title */}
                <h1
                  className="ch-anim ch-d2 text-white"
                  style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: "clamp(60px, 9vw, 118px)",
                    lineHeight: 0.91,
                    letterSpacing: "0.04em",
                    whiteSpace: "pre-line",
                  }}
                >
                  {s.title}
                </h1>

                {/* Subtitle */}
                <p
                  className="ch-anim ch-d3 font-light text-white/60 max-w-[380px] mt-[22px]"
                  style={{ fontSize: "clamp(13px, 1.35vw, 15px)", lineHeight: 1.8 }}
                >
                  {s.subtitle}
                </p>

                {/* Specs — slide 1 only */}
                {s.type === "intro" && (
                  <div className="ch-anim ch-d4 flex mt-9">
                    {s.specs.map((sp, idx) => (
                      <div
                        key={sp.label}
                        className="flex flex-col"
                        style={{
                          padding: "0 24px",
                          paddingLeft: idx === 0 ? 0 : undefined,
                          borderRight:
                            idx < s.specs.length - 1
                              ? "1px solid rgba(255,255,255,0.12)"
                              : "none",
                        }}
                      >
                        <span
                          style={{
                            fontFamily: "'Bebas Neue', sans-serif",
                            fontSize: "38px",
                            color: s.accent,
                            letterSpacing: "0.04em",
                            lineHeight: 1,
                          }}
                        >
                          {sp.value}
                        </span>
                        <span
                          style={{
                            fontSize: "9px",
                            letterSpacing: "0.14em",
                            textTransform: "uppercase",
                            color: "rgba(255,255,255,0.38)",
                            marginTop: "5px",
                          }}
                        >
                          {sp.label}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* CTA — slides 2 & 3 */}
                {(s.type === "testdrive" || s.type === "compare") && (
                  <div className="ch-anim ch-d4 mt-9">
                    <button
                      className="ch-cta inline-flex items-center gap-4 px-8 py-4 bg-transparent text-white relative overflow-hidden rounded-sm cursor-pointer"
                      style={{
                        border: `1.5px solid ${s.accent}`,
                        fontFamily: "'Outfit', sans-serif",
                        fontSize: "12px",
                        fontWeight: 600,
                        letterSpacing: "0.14em",
                        textTransform: "uppercase",
                      }}
                    >
                      <span className="relative z-[1]">{s.cta}</span>
                      <em className="ch-icon relative z-[1] not-italic text-lg transition-transform duration-300">
                        {s.ctaIcon}
                      </em>
                    </button>
                  </div>
                )}
              </div>

              {/* Diagonal cut */}
              <div
                className="ch-cut absolute bottom-[-2px] left-[-2px] right-[-2px] h-40 z-[3]"
                style={{ background: "#0a0a0a" }}
              />
            </div>
          ))}
        </div>

        {/* ── Slide counter ── */}
        <div
          className="ch-counter absolute top-1/2 -translate-y-1/2 z-[5] flex flex-col items-center gap-2"
          style={{ right: "5.5vw" }}
        >
          <span
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "44px", color: "#fff", lineHeight: 1,
            }}
          >
            0{cur + 1}
          </span>
          <div
            className="w-px h-16 relative overflow-hidden"
            style={{ background: "rgba(255,255,255,0.14)" }}
          >
            <div
              className="absolute top-0 inset-x-0"
              style={{ height: `${prog}%`, background: sl.accent, transition: "height .1s linear" }}
            />
          </div>
          <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.28)", letterSpacing: "0.08em" }}>
            0{slides.length}
          </span>
        </div>

        {/* ── Dots ── */}
        <div
          className="absolute z-[5] flex items-center gap-2"
          style={{ bottom: "32px", left: "7vw" }}
        >
          {slides.map((_, i) => (
            <button
              key={i}
              className="h-0.5 border-0 rounded-full cursor-pointer p-0"
              style={{
                width: i === cur ? "44px" : "20px",
                background: i === cur ? sl.accent : "rgba(255,255,255,0.22)",
                transition: "width .32s, background .32s",
              }}
              onClick={() => goTo(i)}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>

        {/* ── Arrows ── */}
        <div
          className="absolute z-[5] flex gap-2"
          style={{ bottom: "24px", right: "5.5vw" }}
        >
          <button
            className="w-11 h-11 border border-white/20 bg-white/5 backdrop-blur-sm text-white text-lg cursor-pointer flex items-center justify-center rounded-sm transition-all duration-200 hover:bg-white/10 hover:border-white/40"
            onClick={() => goTo((cur - 1 + slides.length) % slides.length)}
            aria-label="Previous"
          >
            &#8592;
          </button>
          <button
            className="w-11 h-11 border border-white/20 bg-white/5 backdrop-blur-sm text-white text-lg cursor-pointer flex items-center justify-center rounded-sm transition-all duration-200 hover:bg-white/10 hover:border-white/40"
            onClick={() => goTo((cur + 1) % slides.length)}
            aria-label="Next"
          >
            &#8594;
          </button>
        </div>
      </section>
    </>
  );
}