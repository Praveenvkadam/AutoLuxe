import React, { useState, useRef, useEffect } from "react";

const links = ["Home", "About", "Services", "Contact"];

const pageContent = {
  Home: {
    label: "Welcome",
    title: <>Perfect <em>balance</em> of form &amp; function</>,
    body: "Every interaction polished, every pixel intentional. This navbar features a pixel-accurate sliding underline, a right-side mobile drawer, and a refined warm typographic palette.",
    tag: "Crafted with care",
  },
  About: {
    label: "Our story",
    title: <>Built with <em>purpose</em> in mind</>,
    body: "Great interfaces feel inevitable — as if they couldn't have been made any other way. We obsess over the details so the product feels effortless.",
    tag: "Est. 2024",
  },
  Services: {
    label: "What we do",
    title: <>Work that <em>speaks</em> for itself</>,
    body: "From strategy to pixel-perfect execution, every service is designed to bring clarity, elegance, and lasting value to what you build.",
    tag: "Full spectrum",
  },
  Contact: {
    label: "Get in touch",
    title: <>Let's make something <em>great</em></>,
    body: "Good projects start with a conversation. Whether you have a brief or just a spark of an idea — we'd love to hear from you.",
    tag: "Always open",
  },
};

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'DM Sans', sans-serif; background: #f5f3ee; min-height: 100vh; }

  .nav-wrapper {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    display: flex; justify-content: center;
    padding: 18px 24px 0;
  }
  .nav-bar {
    width: 100%; max-width: 900px;
    background: rgba(255,252,248,0.88);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(0,0,0,0.08);
    border-radius: 16px;
    padding: 0 28px;
    height: 58px;
    display: flex; align-items: center; justify-content: space-between;
    box-shadow: 0 2px 20px rgba(0,0,0,0.06);
  }
  .brand {
    font-family: 'DM Serif Display', serif;
    font-size: 21px; letter-spacing: -0.3px;
    color: #1a1714; user-select: none;
  }
  .brand em { font-style: italic; color: #b57c3a; }

  .nav-links {
    display: flex; align-items: center; gap: 2px;
    position: relative;
  }
  .nav-link-btn {
    background: none; border: none; cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px; font-weight: 400;
    color: #7a7570;
    padding: 6px 16px 8px;
    border-radius: 8px;
    transition: color 0.2s, background 0.15s;
    letter-spacing: 0.01em;
    position: relative;
  }
  .nav-link-btn.active { color: #1a1714; font-weight: 500; }
  .nav-link-btn:hover:not(.active) { color: #3d3a36; background: rgba(0,0,0,0.04); }

  .slider-line {
    position: absolute;
    bottom: -1px; height: 2px;
    background: linear-gradient(90deg, #b57c3a, #e2a855);
    border-radius: 99px;
    transition: left 0.32s cubic-bezier(0.4,0,0.2,1), width 0.32s cubic-bezier(0.4,0,0.2,1);
    pointer-events: none;
  }

  .hamburger {
    display: none;
    background: none; border: none; cursor: pointer;
    width: 36px; height: 36px;
    align-items: center; justify-content: center;
    border-radius: 8px; transition: background 0.15s; color: #1a1714;
    flex-direction: column; gap: 5px;
  }
  .hamburger:hover { background: rgba(0,0,0,0.06); }
  .hamburger span {
    display: block; width: 20px; height: 1.5px;
    background: #1a1714; border-radius: 99px;
    transition: transform 0.25s, opacity 0.25s;
    transform-origin: center;
  }
  .hamburger.open span:nth-child(1) { transform: translateY(6.5px) rotate(45deg); }
  .hamburger.open span:nth-child(2) { opacity: 0; transform: scaleX(0); }
  .hamburger.open span:nth-child(3) { transform: translateY(-6.5px) rotate(-45deg); }

  .overlay {
    position: fixed; inset: 0; z-index: 200;
    background: rgba(0,0,0,0); pointer-events: none;
    transition: background 0.3s;
  }
  .overlay.open { background: rgba(0,0,0,0.25); pointer-events: auto; }

  .sidebar {
    position: fixed; top: 0; right: 0; bottom: 0;
    width: 260px; z-index: 201;
    background: #fffcf8;
    border-left: 1px solid rgba(0,0,0,0.08);
    transform: translateX(100%);
    transition: transform 0.35s cubic-bezier(0.4,0,0.2,1);
    display: flex; flex-direction: column;
    box-shadow: -8px 0 32px rgba(0,0,0,0.08);
  }
  .sidebar.open { transform: translateX(0); }

  .sidebar-head {
    display: flex; align-items: center; justify-content: space-between;
    padding: 20px 20px 16px;
    border-bottom: 1px solid rgba(0,0,0,0.07);
  }
  .sidebar-brand {
    font-family: 'DM Serif Display', serif;
    font-size: 19px; color: #1a1714;
  }
  .sidebar-brand em { font-style: italic; color: #b57c3a; }
  .close-btn {
    background: none; border: none; cursor: pointer;
    width: 32px; height: 32px;
    display: flex; align-items: center; justify-content: center;
    border-radius: 8px; transition: background 0.15s; color: #7a7570;
  }
  .close-btn:hover { background: rgba(0,0,0,0.06); color: #1a1714; }

  .sidebar-links {
    padding: 16px 12px; display: flex; flex-direction: column; gap: 4px; flex: 1;
  }
  .sidebar-link {
    background: none; border: none; cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    font-size: 15px; text-align: left;
    padding: 11px 16px;
    border-radius: 10px; color: #5a5752;
    transition: background 0.15s, color 0.15s;
    display: flex; align-items: center; justify-content: space-between;
  }
  .sidebar-link:hover:not(.active) { background: rgba(0,0,0,0.04); color: #1a1714; }
  .sidebar-link.active { background: rgba(181,124,58,0.1); color: #8a5a1e; font-weight: 500; }
  .sidebar-link .dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: #b57c3a; opacity: 0; transition: opacity 0.2s;
  }
  .sidebar-link.active .dot { opacity: 1; }

  .sidebar-footer {
    padding: 16px 20px;
    border-top: 1px solid rgba(0,0,0,0.07);
    font-size: 12px; color: #a09c98;
    font-family: 'DM Sans', sans-serif;
  }

  .main {
    padding-top: 110px; min-height: 100vh;
    display: flex; justify-content: center; align-items: flex-start;
    padding-left: 24px; padding-right: 24px;
  }
  .content-card {
    width: 100%; max-width: 700px;
    background: #fffcf8;
    border: 1px solid rgba(0,0,0,0.08);
    border-radius: 20px;
    padding: 60px 56px;
    box-shadow: 0 4px 40px rgba(0,0,0,0.05);
    position: relative; overflow: hidden;
  }
  .content-card::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0; height: 3px;
    background: linear-gradient(90deg, #b57c3a, #e2a855, #b57c3a);
  }
  .page-label {
    font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase;
    color: #b57c3a; font-weight: 500; margin-bottom: 12px;
  }
  .page-title {
    font-family: 'DM Serif Display', serif;
    font-size: 42px; line-height: 1.1; letter-spacing: -1px;
    color: #1a1714; margin-bottom: 20px;
  }
  .page-title em { font-style: italic; color: #b57c3a; }
  .page-body {
    font-size: 15px; line-height: 1.8; color: #6b6660; max-width: 420px;
  }
  .page-tag {
    display: inline-block; margin-top: 28px;
    font-size: 12px; padding: 6px 14px;
    border-radius: 99px;
    background: rgba(181,124,58,0.1);
    color: #8a5a1e; letter-spacing: 0.04em;
  }

  @media (max-width: 680px) {
    .nav-links { display: none; }
    .hamburger { display: flex; }
    .content-card { padding: 40px 28px; }
    .page-title { font-size: 32px; }
  }
`;

function Navbar({ active, setActive }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const containerRef = useRef(null);
  const itemRefs = useRef([]);
  const [lineStyle, setLineStyle] = useState({ left: 0, width: 0 });

  useEffect(() => {
    const idx = links.indexOf(active);
    const el = itemRefs.current[idx];
    if (el && containerRef.current) {
      const r = el.getBoundingClientRect();
      const p = containerRef.current.getBoundingClientRect();
      setLineStyle({ left: r.left - p.left, width: r.width });
    }
  }, [active]);

  return (
    <>
      <style>{styles}</style>

      <div className="nav-wrapper">
        <nav className="nav-bar">
          <span className="brand">Br<em>a</em>nd</span>

          {/* Desktop Links */}
          <div ref={containerRef} className="nav-links">
            <span
              className="slider-line"
              style={{ left: lineStyle.left + "px", width: lineStyle.width + "px" }}
            />
            {links.map((link, i) => (
              <button
                key={link}
                ref={(el) => (itemRefs.current[i] = el)}
                className={`nav-link-btn${active === link ? " active" : ""}`}
                onClick={() => setActive(link)}
              >
                {link}
              </button>
            ))}
          </div>

          {/* Hamburger */}
          <button
            className={`hamburger${sidebarOpen ? " open" : ""}`}
            onClick={() => setSidebarOpen((o) => !o)}
            aria-label="Menu"
          >
            <span /><span /><span />
          </button>
        </nav>
      </div>

      {/* Overlay */}
      <div
        className={`overlay${sidebarOpen ? " open" : ""}`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Right Sidebar */}
      <div className={`sidebar${sidebarOpen ? " open" : ""}`}>
        <div className="sidebar-head">
          <span className="sidebar-brand">Br<em>a</em>nd</span>
          <button className="close-btn" onClick={() => setSidebarOpen(false)} aria-label="Close">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M2 2l12 12M14 2L2 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <div className="sidebar-links">
          {links.map((link) => (
            <button
              key={link}
              className={`sidebar-link${active === link ? " active" : ""}`}
              onClick={() => { setActive(link); setSidebarOpen(false); }}
            >
              {link}
              <span className="dot" />
            </button>
          ))}
        </div>
        <div className="sidebar-footer">Navigation · 2024</div>
      </div>
    </>
  );
}

export default function App() {
  const [active, setActive] = useState("Home");
  const p = pageContent[active];

  return (
    <div>
      <Navbar active={active} setActive={setActive} />
      <main className="main">
        <div className="content-card">
          <p className="page-label">{p.label}</p>
          <h2 className="page-title">{p.title}</h2>
          <p className="page-body">{p.body}</p>
          <span className="page-tag">{p.tag}</span>
        </div>
      </main>
    </div>
  );
}