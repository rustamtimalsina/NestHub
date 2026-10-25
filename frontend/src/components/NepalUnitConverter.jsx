import { useState, useEffect } from "react";
import {
  sqftToRopani,
  sqftToBigha,
  formatNepaliPrice,
  nprToUsd,
  SQFT_PER_AANA,
  SQFT_PER_ROPANI,
} from "../utils/nepalUnits";
import { Calculator, ArrowRightLeft, DollarSign, Layers } from "lucide-react";

export default function NepalUnitConverter({ initialSqft = 1200, initialPrice = 0 }) {
  const [sqft, setSqft] = useState(initialSqft);
  const [system, setSystem] = useState("pahad"); // 'pahad' (Ropani-Aana) or 'terai' (Bigha-Katha)
  const [showUsd, setShowUsd] = useState(false);

  useEffect(() => {
    if (initialSqft) setSqft(initialSqft);
  }, [initialSqft]);

  const ropaniData = sqftToRopani(sqft);
  const bighaData = sqftToBigha(sqft);

  // Quick preset buttons (e.g. 3 Aana, 4 Aana, 1 Ropani, 1000 sqft)
  const presets = [
    { label: "3 Aana", val: Math.round(3 * SQFT_PER_AANA) },
    { label: "4 Aana", val: Math.round(4 * SQFT_PER_AANA) },
    { label: "8 Aana", val: Math.round(8 * SQFT_PER_AANA) },
    { label: "1 Ropani", val: SQFT_PER_ROPANI },
    { label: "Property Area", val: initialSqft },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-100 dark:border-slate-800 shadow-xs transition-colors">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center font-bold">
            <Layers size={20} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              Nepal Land & Currency Converter
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300">
                Local Units
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Convert between Sq. Ft, Aana-Ropani (Hills/Valley), and Bigha-Katha (Terai).
            </p>
          </div>
        </div>

        {/* Currency Switcher */}
        {initialPrice > 0 && (
          <button
            type="button"
            onClick={() => setShowUsd(!showUsd)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 transition cursor-pointer"
          >
            <DollarSign size={13} className="text-emerald-600" />
            {showUsd ? "Switch to NPR (Lakh/Cr)" : "Convert to USD ($)"}
          </button>
        )}
      </div>

      {/* Price Summary Banner if price provided */}
      {initialPrice > 0 && (
        <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-800/60 border border-blue-100/60 dark:border-slate-700 flex flex-wrap items-center justify-between gap-2">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Listing Price Equivalent:
            </span>
            <div className="text-xl font-black text-slate-900 dark:text-white">
              {showUsd ? (
                <>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                    {nprToUsd(initialPrice)}
                  </span>
                  <span className="text-xs font-normal text-slate-400 ml-2">
                    (@ 1 USD ≈ 135 NPR)
                  </span>
                </>
              ) : (
                <>
                  <span className="text-blue-600 dark:text-blue-400">
                    {formatNepaliPrice(initialPrice)}
                  </span>
                  <span className="text-xs font-normal text-slate-400 ml-2">
                    (Rs. {Number(initialPrice).toLocaleString()})
                  </span>
                </>
              )}
            </div>
          </div>

          <div className="text-right">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Rate per Aana (approx):
            </span>
            <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
              {ropaniData.totalAana > 0
                ? formatNepaliPrice(Math.round(initialPrice / ropaniData.totalAana)) + " / Aana"
                : "N/A"}
            </p>
          </div>
        </div>
      )}

      {/* Input Slider & Number Field */}
      <div className="grid sm:grid-cols-3 gap-4 mb-6">
        <div className="sm:col-span-2 space-y-2">
          <div className="flex justify-between items-center text-xs font-semibold text-slate-600 dark:text-slate-300">
            <span>Area in Square Feet (sq. ft)</span>
            <span className="font-bold text-blue-600 dark:text-blue-400 text-sm">
              {Number(sqft).toLocaleString()} sq. ft
            </span>
          </div>
          <input
            type="range"
            min="100"
            max="15000"
            step="25"
            value={sqft}
            onChange={(e) => setSqft(Number(e.target.value))}
            className="w-full accent-blue-600 h-2 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
          />
          <div className="flex flex-wrap gap-1.5 pt-1">
            {presets.map((p, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setSqft(p.val)}
                className={`text-[11px] px-2.5 py-1 rounded-lg border font-medium transition cursor-pointer ${
                  sqft === p.val
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
            Direct Sq. Ft Input
          </label>
          <input
            type="number"
            min="1"
            value={sqft}
            onChange={(e) => setSqft(Math.max(1, Number(e.target.value) || 0))}
            className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-bold text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Tabs: Hilly (Ropani-Aana) vs Terai (Bigha-Katha) */}
      <div className="flex border-b border-slate-200 dark:border-slate-700 mb-6">
        <button
          type="button"
          onClick={() => setSystem("pahad")}
          className={`pb-2.5 px-4 text-xs font-bold transition border-b-2 cursor-pointer ${
            system === "pahad"
              ? "border-blue-600 text-blue-600 dark:text-blue-400"
              : "border-transparent text-slate-400 hover:text-slate-600"
          }`}
        >
          Kathmandu & Hilly System (Ropani - Aana - Paisa - Daam)
        </button>
        <button
          type="button"
          onClick={() => setSystem("terai")}
          className={`pb-2.5 px-4 text-xs font-bold transition border-b-2 cursor-pointer ${
            system === "terai"
              ? "border-blue-600 text-blue-600 dark:text-blue-400"
              : "border-transparent text-slate-400 hover:text-slate-600"
          }`}
        >
          Terai System (Bigha - Katha - Dhur)
        </button>
      </div>

      {/* Converted Output Display */}
      {system === "pahad" ? (
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-800 text-center">
            <span className="text-xs uppercase font-semibold text-slate-400 tracking-wider">
              Official Land Measure (R-A-P-D)
            </span>
            <p className="text-3xl font-black text-slate-900 dark:text-white mt-1 tracking-tight">
              {ropaniData.code}
            </p>
            <p className="text-sm font-bold text-blue-600 dark:text-blue-400 mt-1">
              ≈ {ropaniData.totalAana} Total Aana ({ropaniData.label})
            </p>
          </div>

          <div className="grid grid-cols-4 gap-2 text-center text-xs">
            <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Ropani</span>
              <span className="text-base font-bold text-slate-800 dark:text-white">{ropaniData.ropani}</span>
              <span className="text-[10px] text-slate-400 block">5,476 sq ft</span>
            </div>
            <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Aana</span>
              <span className="text-base font-bold text-slate-800 dark:text-white">{ropaniData.aana}</span>
              <span className="text-[10px] text-slate-400 block">342.25 sq ft</span>
            </div>
            <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Paisa</span>
              <span className="text-base font-bold text-slate-800 dark:text-white">{ropaniData.paisa}</span>
              <span className="text-[10px] text-slate-400 block">85.56 sq ft</span>
            </div>
            <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Daam</span>
              <span className="text-base font-bold text-slate-800 dark:text-white">{ropaniData.daam}</span>
              <span className="text-[10px] text-slate-400 block">21.39 sq ft</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-800 text-center">
            <span className="text-xs uppercase font-semibold text-slate-400 tracking-wider">
              Terai Measure (B-K-D)
            </span>
            <p className="text-3xl font-black text-slate-900 dark:text-white mt-1 tracking-tight">
              {bighaData.code}
            </p>
            <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mt-1">
              ≈ {bighaData.label}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center text-xs">
            <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Bigha</span>
              <span className="text-base font-bold text-slate-800 dark:text-white">{bighaData.bigha}</span>
              <span className="text-[10px] text-slate-400 block">72,900 sq ft</span>
            </div>
            <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Katha</span>
              <span className="text-base font-bold text-slate-800 dark:text-white">{bighaData.katha}</span>
              <span className="text-[10px] text-slate-400 block">3,645 sq ft</span>
            </div>
            <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Dhur</span>
              <span className="text-base font-bold text-slate-800 dark:text-white">{bighaData.dhur}</span>
              <span className="text-[10px] text-slate-400 block">182.25 sq ft</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
