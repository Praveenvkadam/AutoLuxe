export const allCars = [
  // ── SUVs ──────────────────────────────────────────────────────────────
  {
    id: 1, type: "SUV", brand: "Mahindra", model: "XUV700 AX7 L AWD",
    price: "₹24.99 L", year: 2024, hp: "200 HP", speed: "200", acc: "8.5",
    // Commons: CC BY-SA 4.0 · Ank Kumar, Infosys Limited
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/A_black_Mahindra_XUV700_SUV_in_Ashiana_Brahmananda%2C_Jamshedpur%2C_India_(Ank_Kumar%2C_Infosys_Limited)_01.jpg",
    badge: "NEW", fuel: "Petrol",
  },
  {
    id: 2, type: "SUV", brand: "Kia", model: "Seltos X-Line 1.5 Turbo",
    price: "₹19.65 L", year: 2024, hp: "160 HP", speed: "185", acc: "8.9",
    // Commons: CC BY-SA 4.0 · 4th International Auto Show Bangalore 2025
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/4th_International_Auto_Show%2C_Bangalore_(2025)_96.jpg",
    badge: "HOT", fuel: "Petrol",
  },

  // ── Coupes ────────────────────────────────────────────────────────────
  {
    id: 3, type: "Coupe", brand: "Tata", model: "Curvv EV 55 Empowered",
    price: "₹21.99 L", year: 2024, hp: "167 HP", speed: "160", acc: "8.6",
    // Commons: CC BY-SA 4.0 · Tata Nexon EV (same Ziptron platform / near-identical front)
    image: "data:image/jpeg;base64,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JMCgFFuk90qJBFxJfbd0+sbkd0CfiT6oA6/hK/GYjtciH1UpqEUXva2rt4s1yfIcpJZ7ieaGIRNTh6dQ8QWNQa8fWUNlcDpYd94Eyrs1aS4fNUKU61jVU5rWBUq7KONlqKfiOMxbW3eelVYU1Z1Y/q8oLHNezUzYasPmLMNDPm8GKap2TVGuTQTzzuzsdNALkjytykzE1GUKA7KTQpJUUMQDlQCzDnpYeVoFTV9RQp43trra0jGsZLq080+pgzyECDcmfcplvR2W54KZYYbdis/BD8IGtBDPYQze8HuFWf3TL3BejJj7WkDlQpmZUw7HgDO24L0bUl9oy6w25WGT3bwOAU8DVPBWmf8AQ+IYfsnIPcZ+jKGw6CcKa/CTaeHVeCgeQlH5gG6WMJ9TDVW8FMt9m7ibSc/+kdO92RB53N5+jBEDne4m4NXCP29dk7W1hY5soPEDQanrOiAREBERAREQEREBIW0sIagsDaTYgaDtTdio19LzWcdus/2TOyTy1MHiBA4Hid3GHuytr7EYcp+hqmAptxQSJV2BRb3IH53qbLYcpGfAMOU/QlXdCgeUiVdxaJ5/KQcBbCHpMZw56TvL+j2kefymFvRzT+0PhA4UaBnllIncz6NKf2h8JjPoupHi/wAoHDxWnsOPHqJ2l/RFh241WHgo/OfE9DWDvc1q58Co/AwOO9qpCggnJfLexsCcxHeL3P3jLnY+yauLe9jlvcnqZ2DA+jHZ1P8AqWqH+0qO3yuB8ps+C2ZSogLSpogHJQBA5nsz0eEgFhbxmy4LcSivHWblaJRT4bdygnBBLClgkXgo+EkRA+BQOU+xEBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQERED//2Q==",
    badge: "NEW", fuel: "Electric",
  },
  {
    id: 4, type: "Coupe", brand: "Mahindra", model: "BE 6e Pack 3",
    price: "₹26.90 L", year: 2025, hp: "286 HP", speed: "201", acc: "6.7",
    // Commons: CC BY-SA 4.0 · Same XUV700 body for now — BE 6e not yet on Commons
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/A_black_Mahindra_XUV700_SUV_in_Ashiana_Brahmananda%2C_Jamshedpur%2C_India_(Ank_Kumar%2C_Infosys_Limited)_02.jpg",
    badge: "SPORT", fuel: "Electric",
  },

  // ── Mini-SUVs ─────────────────────────────────────────────────────────
  {
    id: 5, type: "Mini-SUV", brand: "Kia", model: "Sonet X-Line 1.0 T-GDi",
    price: "₹14.89 L", year: 2024, hp: "120 HP", speed: "180", acc: "10.5",
    // Commons: CC BY-SA 4.0 · Kia Sonet QY FL front
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/Kia_Sonet_QY_FL_1.5_EX_Imperial_Blue_-_front.jpg",
    badge: "NEW", fuel: "Petrol",
  },
  {
    id: 6, type: "Mini-SUV", brand: "Skoda", model: "Kushaq Monte Carlo 1.5 TSI",
    price: "₹17.99 L", year: 2024, hp: "150 HP", speed: "205", acc: "8.5",
    // Commons: CC BY-SA 4.0 · India-spec Kushaq official front view
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/2021_%C5%A0koda_Kushaq_(India)_front_view.png",
    badge: "ELITE", fuel: "Petrol",
  },

  // ── Sedans ────────────────────────────────────────────────────────────
  {
    id: 7, type: "Sedan", brand: "Skoda", model: "Slavia Monte Carlo 1.5 TSI",
    price: "₹17.49 L", year: 2024, hp: "150 HP", speed: "212", acc: "8.1",
    // Commons: CC BY-SA 4.0 · India-spec Slavia official front view
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/2021_%C5%A0koda_Slavia_1.5_TSI_Style_(India)_front_view.png",
    badge: "HOT", fuel: "Petrol",
  },
  {
    id: 8, type: "Sedan", brand: "VW", model: "Virtus GT 1.5 TSI DSG",
    price: "₹16.99 L", year: 2024, hp: "150 HP", speed: "210", acc: "8.0",
    // Commons: CC BY-SA 4.0 · India-spec Virtus GT official front view
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/2022_Volkswagen_Virtus_1.5_GT_(India)_front_view_01.png",
    badge: "LUXURY", fuel: "Petrol",
  },
];

export const typeMap = {
  "All Types": null,
  "SUV": "SUV",
  "Mini-SUV": "Mini-SUV",
  "Coupe": "Coupe",
  "Sedan": "Sedan",
};

export const priceMap = {
  "Any Price":      [0, Infinity],
  "Under ₹15L":    [0, 15],
  "₹15L – ₹18L":  [15, 18],
  "₹18L – ₹22L":  [18, 22],
  "₹22L – ₹27L":  [22, 27],
  "₹27L+":         [27, Infinity],
};

export const badgeCfg = {
  NEW:    { bg: "bg-emerald-950", text: "text-emerald-400", border: "border-emerald-600/40" },
  HOT:    { bg: "bg-orange-950",  text: "text-orange-400",  border: "border-orange-600/40"  },
  RARE:   { bg: "bg-purple-950",  text: "text-purple-400",  border: "border-purple-600/40"  },
  LUXURY: { bg: "bg-yellow-950",  text: "text-yellow-400",  border: "border-yellow-600/40"  },
  SPORT:  { bg: "bg-red-950",     text: "text-red-400",     border: "border-red-600/40"     },
  ELITE:  { bg: "bg-sky-950",     text: "text-sky-400",     border: "border-sky-600/40"     },
};

export const typeCfg = {
  "SUV":      { dot: "bg-orange-500",  text: "text-orange-400"  },
  "Coupe":    { dot: "bg-red-500",     text: "text-red-400"     },
  "Mini-SUV": { dot: "bg-emerald-500", text: "text-emerald-400" },
  "Sedan":    { dot: "bg-sky-500",     text: "text-sky-400"     },
};