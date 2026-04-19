import { useState, useRef } from "react";
import Navbar from "./components/Navbar";
import CarHero from "./components/CarHERO";
import CarFilter from "./components/CarFilter";
import CarGrid from "./components/CarGrid";
import Comparison from "./components/Comparison";
import TestDrive from "./components/TestDriveBook";
import AutoLuxeChat from "./components/Autoluxechat";

export default function App() {
  const [activeLink, setActiveLink] = useState("Home");
  const [heroAccent, setHeroAccent] = useState("#e63946");

  const [filters, setFilters] = useState({
    brand: "All Brands",
    priceRange: "Any Price",
    carType: "All Types",
  });
  const [searchVal, setSearchVal] = useState("");

  // ── Chat → Grid highlight ──────────────────────────────────────────────────
  const [highlightCarId, setHighlightCarId] = useState(null);
  const gridRef = useRef(null);

  function handleViewCar(carId) {
    setHighlightCarId(carId);
    setTimeout(() => {
      gridRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  }

  function handleClearHighlight() {
    setHighlightCarId(null);
  }

  // ── Chat / Hero → Comparison ───────────────────────────────────────────────
  const [compareIds, setCompareIds] = useState([1, 3]);
  const comparisonRef = useRef(null);

  function handleCompare(ids) {
    if (ids) setCompareIds(ids);
    setTimeout(() => {
      comparisonRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  }

  // ── Chat / Hero → Test Drive booking (auto-fill) ───────────────────────────
  const [testDrivePreselect, setTestDrivePreselect] = useState(null);
  const testDriveRef = useRef(null);

  function handleBookTestDrive({ brand, model }) {
    setTestDrivePreselect({ brand, model });
    setTimeout(() => {
      testDriveRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  }
  // ──────────────────────────────────────────────────────────────────────────

  return (
    <div className="relative">
      <Navbar accent={heroAccent} active={activeLink} setActive={setActiveLink} />

      <CarHero className=""
        onAccentChange={setHeroAccent}
        onBookTestDrive={handleBookTestDrive}
        onCompare={handleCompare}
      />

      <div className="-mt-5">
        <CarFilter
          filters={filters}
          setFilters={setFilters}
          searchVal={searchVal}
          setSearchVal={setSearchVal}
        />
      </div>

      <div ref={gridRef}>
        <CarGrid
          filters={filters}
          searchVal={searchVal}
          highlightCarId={highlightCarId}
          onClearHighlight={handleClearHighlight}
        />
      </div>

      <div ref={comparisonRef}>
        <Comparison compareIds={compareIds} />
      </div>

      <div ref={testDriveRef}>
        <TestDrive preselect={testDrivePreselect} />
      </div>

      <AutoLuxeChat
        onViewCar={handleViewCar}
        onCompare={handleCompare}
        onBookTestDrive={handleBookTestDrive}
      />

      {activeLink !== "Home" && (
        <section className="min-h-screen bg-[#0e0e0e] flex items-center justify-center text-white/50 text-sm tracking-[0.12em] uppercase">
          {activeLink} — coming soon
        </section>
      )}
    </div>
  );
}