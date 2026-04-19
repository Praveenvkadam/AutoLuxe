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

  const [compareIds, setCompareIds] = useState([1, 3]);
  const comparisonRef = useRef(null);

  function handleCompare(ids) {
    if (ids) setCompareIds(ids);
    setTimeout(() => {
      comparisonRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  }

  const [testDrivePreselect, setTestDrivePreselect] = useState(null);
  const testDriveRef = useRef(null);

  function handleBookTestDrive({ brand, model, date, time }) {
    setTestDrivePreselect({ brand, model, date: date || "", time: time || "" });
    setTimeout(() => {
      testDriveRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  }

  const isHome = activeLink === "Home";

  return (
    <div className="relative">
      <Navbar accent={heroAccent} active={activeLink} setActive={setActiveLink} />

      {isHome ? (
        <>
          <CarHero onAccentChange={setHeroAccent} onBookTestDrive={handleBookTestDrive} onCompare={handleCompare} />
          <CarFilter filters={filters} setFilters={setFilters} searchVal={searchVal} setSearchVal={setSearchVal} />
          <div ref={gridRef}>
            <CarGrid filters={filters} searchVal={searchVal} highlightCarId={highlightCarId} onClearHighlight={handleClearHighlight} />
          </div>
          <div ref={comparisonRef}>
            <Comparison compareIds={compareIds} />
          </div>
          <div ref={testDriveRef}>
            <TestDrive preselect={testDrivePreselect} />
          </div>
        </>
      ) : (
        <section className="min-h-screen bg-[#0e0e0e] flex items-center justify-center text-white/50 text-sm tracking-[0.12em] uppercase">
          {activeLink} — coming soon
        </section>
      )}

      <AutoLuxeChat onViewCar={handleViewCar} onCompare={handleCompare} onBookTestDrive={handleBookTestDrive} />
    </div>
  );
}