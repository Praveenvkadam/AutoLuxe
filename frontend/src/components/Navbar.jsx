import { useState, useRef, useEffect } from "react";

const links = ["Home", "About", "Services", "Contact"];


const minimalCss = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Outfit:wght@300;400;500;600&display=swap');

  /* Glowing slider underline */
  .nav-slider-line {
    position: absolute;
    bottom: -1px;
    height: 2px;
    border-radius: 99px;
    background: var(--nav-accent, #e63946);
    box-shadow: 0 0 8px var(--nav-accent, #e63946);
    transition: left 0.32s cubic-bezier(0.4,0,0.2,1),
                width 0.32s cubic-bezier(0.4,0,0.2,1);
    pointer-events: none;
  }

  /* Sidebar slide-in */
  .nav-sidebar {
    transform: translateX(100%);
    transition: transform 0.35s cubic-bezier(0.4,0,0.2,1);
  }
  .nav-sidebar.open { transform: translateX(0); }

  /* Hamburger → X morphs */
  .nav-hamburger.open span:nth-child(1) { transform: translateY(6.5px) rotate(45deg); }
  .nav-hamburger.open span:nth-child(2) { opacity: 0; transform: scaleX(0); }
  .nav-hamburger.open span:nth-child(3) { transform: translateY(-6.5px) rotate(-45deg); }

  /* Active sidebar dot */
  .nav-sidebar-link.active .nav-sidebar-dot { opacity: 1; }
  .nav-sidebar-dot { opacity: 0; transition: opacity 0.2s; }

  @media (max-width: 720px) {
    .nav-links-desktop { display: none !important; }
    .nav-cta-desktop   { display: none !important; }
    .nav-hamburger     { display: flex !important; }
  }
`;

export default function Navbar({ accent = "#e63946", active, setActive }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [scrolled, setScrolled]       = useState(false);
  const containerRef = useRef(null);
  const itemRefs     = useRef([]);
  const [lineStyle, setLineStyle]     = useState({ left: 0, width: 0 });

 
  useEffect(() => {
    const idx = links.indexOf(active);
    const el  = itemRefs.current[idx];
    if (el && containerRef.current) {
      const r = el.getBoundingClientRect();
      const p = containerRef.current.getBoundingClientRect();
      setLineStyle({ left: r.left - p.left, width: r.width });
    }
  }, [active]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <style>{minimalCss}</style>

      <div
        className="fixed top-0 left-0 right-0 z-[200] flex justify-center px-6 pt-[18px] pointer-events-none"
        style={{ "--nav-accent": accent }}
      >
        <nav
          className={[
            "w-full max-w-[960px] h-[58px] flex items-center justify-between px-7 rounded-[14px]",
            "border pointer-events-auto",
            "shadow-[0_4px_32px_rgba(0,0,0,0.35)]",
            "transition-[background,border-color] duration-400",
            scrolled
              ? "bg-[rgba(10,10,10,0.88)] border-white/[0.07]"
              : "bg-[rgba(10,10,10,0.45)] border-white/10",
          ].join(" ")}
          style={{ backdropFilter: "blur(18px) saturate(1.4)" }}
        >
          {/* Logo */}
          <span
            className="text-white no-underline select-none text-[22px] tracking-[0.1em]"
            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
          >
            AUTO<span style={{ color: accent }}>LUXE</span>
          </span>

          <div ref={containerRef} className="nav-links-desktop relative flex items-center gap-0.5">
            <span
              className="nav-slider-line absolute"
              style={{ left: lineStyle.left + "px", width: lineStyle.width + "px" }}
            />
            {links.map((link, i) => (
              <button
                key={link}
                ref={(el) => (itemRefs.current[i] = el)}
                className={[
                  "bg-transparent border-none cursor-pointer rounded-lg px-4 pb-2 pt-1.5",
                  "text-[13px] tracking-[0.04em] uppercase transition-[color,background] duration-200",
                  "font-['Outfit',sans-serif]",
                  active === link
                    ? "text-white font-medium"
                    : "text-white/55 font-normal hover:text-white/85 hover:bg-white/[0.07]",
                ].join(" ")}
                onClick={() => setActive(link)}
              >
                {link}
              </button>
            ))}
          </div>

 
          <div className="flex items-center gap-3">
            <button
              className="nav-cta-desktop text-[11px] font-semibold tracking-[0.12em] uppercase text-white border-none rounded-md px-[18px] py-2 cursor-pointer transition-[opacity,transform] duration-200 hover:opacity-[0.88] hover:-translate-y-px active:translate-y-0"
              style={{ background: accent, fontFamily: "'Outfit', sans-serif" }}
            >
              Get a Quote
            </button>

            <button
              className={`nav-hamburger hidden flex-col items-center justify-center gap-[5px] w-[38px] h-[38px] bg-transparent border border-white/[0.18] rounded-lg cursor-pointer transition-[background,border-color] duration-150 hover:bg-white/[0.08] hover:border-white/30`}
              onClick={() => setSidebarOpen((o) => !o)}
              aria-label="Menu"
            >
              {[0, 1, 2].map((n) => (
                <span
                  key={n}
                  className="block w-[18px] h-[1.5px] bg-white rounded-full transition-[transform,opacity] duration-250"
                  style={{ transformOrigin: "center" }}
                />
              ))}
            </button>
          </div>
        </nav>
      </div>

      <div
        className={[
          "fixed inset-0 z-[300] transition-[background] duration-300",
          sidebarOpen ? "bg-black/60 pointer-events-auto" : "bg-transparent pointer-events-none",
        ].join(" ")}
        style={{ "--nav-accent": accent }}
        onClick={() => setSidebarOpen(false)}
      />

   
      <div
        className={`nav-sidebar fixed top-0 right-0 bottom-0 w-[270px] z-[301] flex flex-col border-l border-white/[0.08]${sidebarOpen ? " open" : ""}`}
        style={{ background: "#0e0e0e", "--nav-accent": accent }}
      >
       
        <div className="flex items-center justify-between px-5 pt-[22px] pb-[18px] border-b border-white/[0.07]">
          <span
            className="text-white text-[20px] tracking-[0.1em]"
            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
          >
            AUTO<span style={{ color: accent }}>LUXE</span>
          </span>
          <button
            className="w-8 h-8 flex items-center justify-center bg-transparent border border-white/[0.15] rounded-[7px] cursor-pointer text-white/60 transition-[background,color] duration-150 hover:bg-white/[0.08] hover:text-white"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        
        <div className="flex flex-col gap-1 flex-1 p-3">
          {links.map((link) => (
            <button
              key={link}
              className={[
                "nav-sidebar-link flex items-center justify-between w-full bg-transparent border-none",
                "text-left text-[14px] tracking-[0.08em] uppercase px-4 py-3 rounded-[9px] cursor-pointer",
                "transition-[background,color] duration-150",
                "font-['Outfit',sans-serif]",
                active === link
                  ? "active bg-white/[0.06] text-white font-medium"
                  : "text-white/50 hover:bg-white/[0.06] hover:text-white/85",
              ].join(" ")}
              onClick={() => { setActive(link); setSidebarOpen(false); }}
            >
              {link}
              <span
                className="nav-sidebar-dot w-[5px] h-[5px] rounded-full"
                style={{ background: accent }}
              />
            </button>
          ))}
        </div>

        <div className="px-5 py-[18px] border-t border-white/[0.07]">
          <button
            className="w-full text-[12px] font-semibold tracking-[0.12em] uppercase text-white border-none rounded-lg py-[13px] px-5 cursor-pointer transition-opacity duration-200 hover:opacity-[0.88]"
            style={{ background: accent, fontFamily: "'Outfit', sans-serif" }}
          >
            Get a Quote
          </button>
        </div>
      </div>
    </>
  );
}