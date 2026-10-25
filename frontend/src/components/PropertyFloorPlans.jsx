import { useState } from "react";
import { Layers, Maximize2, Check, ZoomIn } from "lucide-react";

export default function PropertyFloorPlans({ property }) {
  const [activeLevel, setActiveLevel] = useState("ground");
  const [isZoomed, setIsZoomed] = useState(false);

  // Dynamic realistic specs based on property
  const levels = [
    {
      id: "ground",
      name: "Ground Floor",
      area: Math.round(Number(property?.area || 1200) * 0.45),
      rooms: [
        { name: "Living / Family Lounge", dim: "18' x 14'", note: "Spacious layout with natural garden light" },
        { name: "Modular Dining & Kitchen", dim: "14' x 12'", note: "Granite countertop with utility pantry" },
        { name: "Guest Bedroom", dim: "12' x 11'", note: "Fitted wardrobe & garden view" },
        { name: "Common Bathroom", dim: "7' x 5'", note: "Premium sanitary fixtures" },
        { name: "Covered Car Parking", dim: "2 Cars", note: "Dedicated porch with paver tiles" },
      ],
      svgType: "ground",
    },
    {
      id: "first",
      name: "First Floor",
      area: Math.round(Number(property?.area || 1200) * 0.4),
      rooms: [
        { name: "Master Suite", dim: "16' x 14'", note: "Attached luxury bath & private balcony" },
        { name: "Bedroom 2", dim: "13' x 12'", note: "Attached bathroom & study desk space" },
        { name: "Family Study / TV Lobby", dim: "12' x 10'", note: "Central transition hall" },
        { name: "Front Balcony", dim: "14' x 5'", note: "Panoramic mountain / road view" },
      ],
      svgType: "first",
    },
    {
      id: "rooftop",
      name: "Rooftop / Terrace",
      area: Math.round(Number(property?.area || 1200) * 0.15),
      rooms: [
        { name: "Open Rooftop Terrace", dim: "Full Open", note: "Waterproofing membrane with 360° views" },
        { name: "Puja / Utility Room", dim: "8' x 6'", note: "Ventilated utility & laundry space" },
        { name: "Solar & Overhead Tank Space", dim: "Dedicated", note: "Structural provision for 1,500L storage" },
      ],
      svgType: "rooftop",
    },
  ];

  const currentLevel = levels.find((l) => l.id === activeLevel) || levels[0];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-100 dark:border-slate-800 shadow-xs transition-colors">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center font-bold">
            <Layers size={20} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              Architectural Floor Plans
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300">
                Level Blueprint
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Interactive room dimensions and structural layouts.
            </p>
          </div>
        </div>

        {/* Level Switcher Buttons */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl">
          {levels.map((lvl) => (
            <button
              key={lvl.id}
              onClick={() => setActiveLevel(lvl.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeLevel === lvl.id
                  ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
              }`}
            >
              {lvl.name}
            </button>
          ))}
        </div>
      </div>

      {/* Blueprint Visual & Room Breakdown Grid */}
      <div className="grid lg:grid-cols-5 gap-6">
        {/* Schematic Blueprint Visual */}
        <div
          className={`lg:col-span-3 rounded-2xl border-2 border-dashed border-blue-200 dark:border-blue-900/60 bg-blue-50/40 dark:bg-slate-800/40 p-6 flex flex-col justify-between relative overflow-hidden transition-all ${
            isZoomed ? "scale-102 shadow-lg" : ""
          }`}
        >
          <div className="flex justify-between items-center mb-4">
            <span className="text-xs font-bold text-blue-900 dark:text-blue-300 uppercase tracking-wider">
              {currentLevel.name} Layout ({currentLevel.area} sq.ft)
            </span>
            <button
              onClick={() => setIsZoomed(!isZoomed)}
              className="flex items-center gap-1 text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
            >
              <ZoomIn size={14} />
              {isZoomed ? "Reset Scale" : "Enlarge Layout"}
            </button>
          </div>

          {/* Clean 2D Blueprint Architectural Representation */}
          <div className="my-auto py-8">
            <div className="max-w-md mx-auto aspect-[4/3] bg-white dark:bg-slate-900 rounded-2xl border-2 border-blue-500 shadow-sm p-4 relative grid grid-cols-2 grid-rows-2 gap-2 text-center text-xs">
              {currentLevel.rooms.slice(0, 4).map((r, i) => (
                <div
                  key={i}
                  className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200/80 dark:border-slate-700 flex flex-col justify-center items-center group hover:bg-blue-50 transition"
                >
                  <span className="font-bold text-slate-800 dark:text-white group-hover:text-blue-600 text-[11px]">
                    {r.name}
                  </span>
                  <span className="font-mono text-[10px] text-blue-600 dark:text-blue-400 font-bold mt-1">
                    {r.dim}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="text-[11px] text-slate-400 text-center mt-3">
            * Schematic floor layout for planning purposes. Exact on-site measurements may vary slightly.
          </div>
        </div>

        {/* Room Dimensions & Specs Column */}
        <div className="lg:col-span-2 space-y-2.5 flex flex-col justify-center">
          <span className="text-xs uppercase font-bold text-slate-400 tracking-wider block mb-1">
            Room Dimensions & Features
          </span>

          {currentLevel.rooms.map((room, idx) => (
            <div
              key={idx}
              className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800"
            >
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  {room.name}
                </span>
                <span className="text-xs font-black text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded-md">
                  {room.dim}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-normal">
                {room.note}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
