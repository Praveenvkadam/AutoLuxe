import { useRef, useEffect, useState } from "react";

const filterData = {
  brand: ["All Brands", "Porsche", "Ferrari", "Lamborghini", "Bentley", "Aston Martin", "McLaren", "Rolls-Royce"],
  model: ["All Models", "911 Turbo S", "Cayenne", "Macan", "F8 Tributo", "Huracán", "Continental GT", "DB11", "720S"],
  priceRange: ["Any Price", "Under $50K", "$50K – $100K", "$100K – $200K", "$200K – $500K", "$500K+"],
  carType: ["All Types", "Coupe", "Sedan", "SUV", "Mini-SUV", "Convertible", "Roadster", "Grand Tourer", "Hypercar"],
};

const filterConfig = [
  { key: "brand",      label: "Brand",       icon: "◈" },
  { key: "model",      label: "Model",       icon: "◉" },
  { key: "priceRange", label: "Price Range", icon: "◆" },
  { key: "carType",    label: "Car Type",    icon: "◇" },
];

function ChevronIcon({ open }) {
  return (
    <svg
      width="12" height="12" viewBox="0 0 12 12" fill="none"
      className="flex-shrink-0 transition-transform duration-300 ease-in-out"
      style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
    >
      <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Dropdown({ config, value, onChange }) {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(null);
  const ref = useRef(null);

  useEffect(() => {
    function handleOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  const isDefault = value === filterData[config.key][0];

  return (
    <div ref={ref} className="relative flex-1" style={{ minWidth: "180px" }}>
      <div className="flex items-center gap-1.5 mb-2">
        <span className="text-orange-500 text-xs">{config.icon}</span>
        <span className="text-gray-500 text-xs tracking-widest uppercase font-semibold" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
          {config.label}
        </span>
      </div>

      <button
        onClick={() => setOpen((o) => !o)}
        className={[
          "w-full flex items-center justify-between gap-2 px-4 py-3 text-sm text-left outline-none transition-all duration-200 border",
          open ? "border-orange-500 bg-orange-500/5" : "border-white/10 bg-white/[0.03]",
          !isDefault || open ? "border-b-2 border-b-orange-500" : "border-b-2 border-b-white/10",
          isDefault ? "text-gray-500 font-normal" : "text-white font-semibold",
        ].join(" ")}
        style={{ fontFamily: "'Rajdhani', sans-serif", letterSpacing: "0.06em" }}
      >
        <span className="truncate">{value}</span>
        <ChevronIcon open={open} />
      </button>

      <div
        className={[
          "absolute left-0 right-0 z-50 max-h-60 overflow-y-auto",
          "border border-orange-500/30 border-t-2 border-t-orange-500 transition-all duration-200",
          open ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-2 pointer-events-none",
        ].join(" ")}
        style={{ top: "calc(100% + 4px)", background: "#131313", boxShadow: "0 20px 60px rgba(0,0,0,0.7)", scrollbarWidth: "thin", scrollbarColor: "#e07b2a #1a1a1a" }}
      >
        {filterData[config.key].map((option) => {
          const isSelected = value === option;
          const isHov = hovered === option;
          return (
            <button
              key={option}
              onMouseEnter={() => setHovered(option)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => { onChange(option); setOpen(false); }}
              className={[
                "w-full flex items-center justify-between px-4 py-3 text-left text-xs outline-none border-l-2 transition-all duration-150",
                isSelected ? "bg-orange-500/15 border-orange-500 text-orange-500 font-bold"
                  : isHov   ? "bg-white/[0.04] border-transparent text-white"
                  :           "bg-transparent border-transparent text-gray-500",
              ].join(" ")}
              style={{ fontFamily: "'Rajdhani', sans-serif", letterSpacing: "0.08em" }}
            >
              {option}
              {isSelected && (
                <svg width="10" height="8" viewBox="0 0 10 8" fill="none" className="flex-shrink-0">
                  <path d="M1 4L3.5 6.5L9 1" stroke="#e07b2a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── Controlled component: all state lives in App.jsx ──────────
export default function CarFilterPanel({ filters, setFilters, searchVal, setSearchVal }) {
  const activeCount = Object.entries(filters).filter(([k, v]) => v !== filterData[k][0]).length;

  const handleReset = () => {
    setFilters({ brand: "All Brands", model: "All Models", priceRange: "Any Price", carType: "All Types" });
    setSearchVal("");
  };

  return (
    <div className="flex items-center justify-center px-5 py-12" style={{ background: "#0c0c0c" }}>
      <link href="https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&family=Bebas+Neue&display=swap" rel="stylesheet" />

      <div className="w-full max-w-5xl">
        {/* Header */}
        <div className="flex items-end justify-between flex-wrap gap-3 mb-7">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2.5 text-orange-500 text-xs font-semibold tracking-widest uppercase" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
              <span className="w-8 h-px bg-orange-500 block" />
              Find Your Vehicle
            </div>
            <div className="flex items-baseline gap-2">
              <h2 className="text-4xl text-white tracking-widest leading-none" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                SEARCH <span className="text-orange-500">INVENTORY</span>
              </h2>
              {activeCount > 0 && (
                <span className="text-xs font-bold tracking-widest text-black bg-orange-500 px-2.5 py-0.5"
                  style={{ fontFamily: "'Rajdhani', sans-serif", clipPath: "polygon(6px 0%,100% 0%,calc(100% - 6px) 100%,0% 100%)" }}>
                  {activeCount} ACTIVE
                </span>
              )}
            </div>
          </div>
          {activeCount > 0 && (
            <button onClick={handleReset}
              className="flex items-center gap-2 px-4 py-2 border border-white/15 text-gray-500 text-xs tracking-widest uppercase font-semibold bg-transparent hover:border-orange-500 hover:text-orange-500 transition-all duration-200"
              style={{ fontFamily: "'Rajdhani', sans-serif" }}>
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M1 1L9 9M9 1L1 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              Clear All
            </button>
          )}
        </div>

        {/* Panel */}
        <div className="relative p-7 border border-white/[0.08] border-t-2 overflow-hidden"
          style={{ borderTopColor: "#e07b2a", background: "linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)" }}>
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(ellipse at top left, rgba(224,123,42,0.05) 0%, transparent 60%)" }} />
          <div className="absolute bottom-0 right-0 w-14 h-14 border-t border-l border-orange-500/20" />

          {/* Search */}
          <div className="mb-6">
            <div className="flex items-center gap-1.5 mb-2 text-gray-500 text-xs tracking-widest uppercase font-semibold" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
              <span className="text-orange-500">◈</span> Quick Search
            </div>
            <div className="relative">
              <input type="text" value={searchVal} onChange={(e) => setSearchVal(e.target.value)}
                placeholder="Search by make, model, or keyword..."
                className="w-full px-4 py-3 pr-11 text-sm text-white bg-white/[0.03] border border-white/10 border-b-2 border-b-white/10 placeholder-gray-700 outline-none focus:bg-orange-500/5 focus:border-orange-500 focus:border-b-orange-500 transition-all duration-200"
                style={{ fontFamily: "'Rajdhani', sans-serif", letterSpacing: "0.06em" }} />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <circle cx="6.5" cy="6.5" r="5" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M10.5 10.5L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </span>
            </div>
          </div>

          {/* Dropdowns */}
          <div className="flex flex-wrap gap-4">
            {filterConfig.map((config) => (
              <Dropdown key={config.key} config={config} value={filters[config.key]}
                onChange={(val) => setFilters((f) => ({ ...f, [config.key]: val }))} />
            ))}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between flex-wrap gap-3 mt-6 pt-5 border-t border-white/[0.07]">
            <div className="flex items-center flex-wrap gap-2">
              {activeCount === 0 ? (
                <span className="text-xs text-gray-700 tracking-widest" style={{ fontFamily: "'Rajdhani', sans-serif" }}>No filters applied</span>
              ) : (
                Object.entries(filters).filter(([k, v]) => v !== filterData[k][0]).map(([k, v]) => (
                  <span key={k} className="flex items-center gap-1.5 px-2.5 py-1 border border-orange-500/30 bg-orange-500/10 text-orange-500 text-xs font-semibold tracking-widest" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
                    {v}
                    <button onClick={() => setFilters((f) => ({ ...f, [k]: filterData[k][0] }))}
                      className="text-orange-500/70 hover:text-orange-500 transition-colors bg-transparent border-none cursor-pointer text-sm leading-none">×</button>
                  </span>
                ))
              )}
            </div>
            <button
              className="flex items-center gap-2.5 px-8 py-3 bg-orange-500 hover:bg-orange-400 text-black text-xs font-bold tracking-widest uppercase transition-all duration-200 hover:translate-x-0.5"
              style={{ fontFamily: "'Rajdhani', sans-serif", clipPath: "polygon(10px 0%,100% 0%,calc(100% - 10px) 100%,0% 100%)" }}>
              Search Vehicles
              <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
                <path d="M1 5H13M9 1L13 5L9 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}