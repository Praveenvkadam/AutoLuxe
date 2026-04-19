import { badgeCfg, typeCfg } from "../data/cars.js";

export default function CarCard({ car, visible, onBook }) {
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
      
      <div className="relative h-48 overflow-hidden bg-black">
        <img
          src={car.image}
          alt={`${car.brand} ${car.model}`}
          className="w-full h-full object-cover opacity-75 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] via-[#0f0f0f]/20 to-transparent" />

        
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

      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-orange-500 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center" />
    </div>
  );
}
