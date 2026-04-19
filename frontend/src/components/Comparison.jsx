import { useState, useEffect } from "react";
import { allCars, badgeCfg } from "../data/cars.js";

const parsePrice = (p) => Number(p.replace(/[$,]/g, ""));
const parseHp    = (h) => Number(h.replace(" HP", ""));
const parseNum   = (n) => Number(n);

const ROWS = [
  {
    label: "Price",
    higherIsBetter: false,
    get: (c) => parsePrice(c.price),
    display: (c) => c.price,
  },
  {
    label: "Horsepower",
    higherIsBetter: true,
    get: (c) => parseHp(c.hp),
    display: (c) => c.hp,
  },
  {
    label: "Top Speed",
    higherIsBetter: true,
    get: (c) => parseNum(c.speed),
    display: (c) => `${c.speed} km/h`,
  },
  {
    label: "0–100 km/h",
    higherIsBetter: false,
    get: (c) => parseNum(c.acc),
    display: (c) => `${c.acc}s`,
  },
  {
    label: "Year",
    higherIsBetter: true,
    get: (c) => c.year,
    display: (c) => c.year,
  },
  {
    label: "Fuel Type",
    higherIsBetter: null,
    get: (c) => c.fuel,
    display: (c) => c.fuel,
  },
  {
    label: "Body Type",
    higherIsBetter: null,
    get: (c) => c.type,
    display: (c) => c.type,
  },
];

function Arrow({ type }) {
  if (type === "up")
    return (
      <span className="inline-flex items-center gap-0.5 text-emerald-400 text-[10px] font-semibold ml-1.5 shrink-0">
        <svg width="8" height="8" viewBox="0 0 10 10" fill="currentColor">
          <path d="M5 1L9 8H1L5 1Z" />
        </svg>
        Better
      </span>
    );
  if (type === "down")
    return (
      <span className="inline-flex items-center gap-0.5 text-red-400 text-[10px] font-semibold ml-1.5 shrink-0">
        <svg width="8" height="8" viewBox="0 0 10 10" fill="currentColor">
          <path d="M5 9L1 2H9L5 9Z" />
        </svg>
        Lower
      </span>
    );
  return null;
}

function CarDropdown({ label, selectedId, excludeId, onChange }) {
  return (
    <div className="flex flex-col gap-2 flex-1">
      <label className="text-xs text-white/30 tracking-widest uppercase pl-1">{label}</label>
      <div className="relative">
        <select
          value={selectedId}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full bg-[#161616] border border-white/10 text-white text-sm rounded-xl px-4 py-3 outline-none focus:border-white/30 transition-colors cursor-pointer appearance-none pr-10"
        >
          {allCars
            .filter((c) => c.id !== excludeId)
            .map((c) => (
              <option key={c.id} value={c.id}>
                {c.brand} {c.model}
              </option>
            ))}
        </select>
        <svg
          className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none"
          width="16" height="16" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>
    </div>
  );
}

function CarCard({ car, loading }) {
  const b = badgeCfg[car.badge];
  return (
    <div className={`bg-[#111] border border-white/8 rounded-2xl overflow-hidden flex flex-col transition-opacity duration-300 ${loading ? "opacity-30" : "opacity-100"}`}>

      <div className="relative h-52 sm:h-60 bg-[#0d0d0d] overflow-hidden">
        {loading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-2 border-white/10 border-t-white/60 rounded-full animate-spin" />
            <p className="text-xs text-white/30 tracking-wide">Loading...</p>
          </div>
        ) : (
          <img
            src={car.image}
            alt={`${car.brand} ${car.model}`}
            className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
          />
        )}
        <span className={`absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full border ${b.bg} ${b.text} ${b.border}`}>
          {car.badge}
        </span>
        <span className="absolute top-3 right-3 text-xs text-white/60 bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded-full border border-white/10">
          {car.type}
        </span>
      </div>

      <div className="p-5 flex flex-col gap-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-white/40 text-xs uppercase tracking-widest">{car.brand}</p>
            <h3 className="text-white font-semibold text-lg leading-tight mt-0.5">{car.model}</h3>
            <p className="text-white/30 text-xs mt-1">{car.fuel} · {car.year}</p>
          </div>
          <p className="text-xl font-bold text-white shrink-0">{car.price}</p>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {[
            { label: "Power",     value: car.hp           },
            { label: "Top Speed", value: `${car.speed} kmh` },
            { label: "0–100",     value: `${car.acc}s`    },
          ].map((s) => (
            <div key={s.label} className="bg-white/5 border border-white/5 rounded-xl p-2.5 text-center">
              <p className="text-white font-semibold text-xs sm:text-sm">{s.value}</p>
              <p className="text-white/30 text-[10px] mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Comparison({ compareIds = [1, 3] }) {
  const [selectedIds, setSelectedIds] = useState(compareIds);
  const [visibleIds,  setVisibleIds]  = useState(compareIds);
  const [loading,     setLoading]     = useState(false);
  
  useEffect(() => {
    setSelectedIds(compareIds);
    triggerLoad(compareIds);
  }, [compareIds[0], compareIds[1]]);
  
  const triggerLoad = (newIds) => {
    setLoading(true);
    setTimeout(() => {
      setVisibleIds([...newIds]);
      setLoading(false);
    }, 600);
  };
  
  const handleChange = (index, id) => {
    const newIds = [...selectedIds];
    newIds[index] = id;
    setSelectedIds(newIds);
    triggerLoad(newIds);
  };
  
  const cars = visibleIds
    .map((id) => allCars.find((c) => c.id === id))
    .filter(Boolean);
  
  return (
    <div id="compare-section" className="bg-[#0a0a0a] py-20 px-4 sm:px-6 lg:px-12">
      <div className="max-w-5xl mx-auto">


        <div className="mb-12 text-center">
          <p className="text-xs text-white/30 tracking-[0.2em] uppercase mb-3">Head to Head</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white">Compare Models</h2>
          <p className="text-white/40 mt-3 text-sm">Pick any two cars to compare specs side by side</p>
        </div>

        <div className="flex flex-col sm:flex-row items-end gap-3 mb-10 max-w-2xl mx-auto">
          <CarDropdown
            label="Car 1"
            selectedId={selectedIds[0]}
            excludeId={selectedIds[1]}
            onChange={(id) => handleChange(0, id)}
          />
          <div className="pb-3 shrink-0">
            <span className="text-white/20 font-bold text-xl px-1">VS</span>
          </div>
          <CarDropdown
            label="Car 2"
            selectedId={selectedIds[1]}
            excludeId={selectedIds[0]}
            onChange={(id) => handleChange(1, id)}
          />
        </div>

        {cars.length === 2 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {cars.map((car) => (
                <CarCard key={car.id} car={car} loading={loading} />
              ))}
            </div>

            <div className={`border border-white/8 rounded-2xl overflow-hidden transition-opacity duration-300 ${loading ? "opacity-30" : "opacity-100"}`}>
              <div className="grid grid-cols-[1.4fr_1fr_1fr] bg-[#111] border-b border-white/8 px-4 py-3">
                <p className="text-xs text-white/30 uppercase tracking-widest">Spec</p>
                {cars.map((c) => (
                  <p key={c.id} className="text-xs text-white/60 font-medium truncate px-2">
                    {c.model}
                  </p>
                ))}
              </div>

              {ROWS.map((row, idx) => {
                const vals = cars.map((c) => row.get(c));
                return (
                  <div
                    key={row.label}
                    className={`grid grid-cols-[1.4fr_1fr_1fr] px-4 py-3.5 border-b border-white/5 last:border-0 ${idx % 2 === 0 ? "bg-[#0e0e0e]" : "bg-[#111]"}`}
                  >
                    <p className="text-xs sm:text-sm text-white/40 self-center">{row.label}</p>
                    {cars.map((car, i) => {
                      const val  = vals[i];
                      const other = vals[i === 0 ? 1 : 0];
                      const isNum = typeof val === "number" && typeof other === "number";
                      let arrowType = null;
                      if (row.higherIsBetter !== null && isNum && val !== other) {
                        arrowType = (row.higherIsBetter ? val > other : val < other) ? "up" : "down";
                      }
                      return (
                        <div key={car.id} className="flex items-center flex-wrap px-2">
                          <span className="text-xs sm:text-sm text-white font-medium">
                            {row.display(car)}
                          </span>
                          <Arrow type={arrowType} />
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </>
        )}

      </div>
    </div>
  );
}
