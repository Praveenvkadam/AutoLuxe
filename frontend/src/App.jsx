import { useState } from "react";
import Navbar from "./components/Navbar";
import CarHero from "./components/CarHERO";
import CarFilter from "./components/CarFilter";
import CarGrid from "./components/CarGrid";
import Comparison from "./components/Comparison";

export default function App() {
  const [activeLink, setActiveLink] = useState("Home");
  const [heroAccent, setHeroAccent] = useState("#e63946");


  const [filters, setFilters] = useState({
    brand: "All Brands",
    model: "All Models",
    priceRange: "Any Price",
    carType: "All Types",
  });
  const [searchVal, setSearchVal] = useState("");

  return (
    <div className="relative">
      <Navbar
        accent={heroAccent}
        active={activeLink}
        setActive={setActiveLink}
      />

      <CarHero onAccentChange={setHeroAccent} />

      <div className="-mt-30">
        
        <CarFilter
          filters={filters}
          setFilters={setFilters}
          searchVal={searchVal}
          setSearchVal={setSearchVal}
        />
      </div>
      
      <CarGrid filters={filters} searchVal={searchVal} />

      <Comparison/>

      {activeLink !== "Home" && (
        <section className="min-h-screen bg-[#0e0e0e] flex items-center justify-center text-white/50 text-sm tracking-[0.12em] uppercase">
          {activeLink} — coming soon
        </section>
      )}
    </div>
  );
}