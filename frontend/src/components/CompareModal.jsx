import { Link } from "react-router-dom";
import { useCompare } from "../context/CompareContext";
import { X, ArrowRight, Check, Scale, ExternalLink, Trash2 } from "lucide-react";
import { getImageUrl } from "../utils/imageUrl";

const API_URL = import.meta.env.VITE_API_URL;

export function CompareDrawer() {
  const { compareList, clearCompare, setIsCompareOpen, removeFromCompare } = useCompare();

  if (compareList.length === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-slate-900/90 backdrop-blur-xl text-white px-5 py-3.5 rounded-3xl shadow-2xl border border-white/10 flex items-center gap-4 transition-all animate-in fade-in slide-in-from-bottom-5">
      <div className="flex items-center gap-2">
        <Scale size={20} className="text-blue-400" />
        <span className="text-xs font-bold uppercase tracking-wider">
          Compare ({compareList.length}/4)
        </span>
      </div>

      {/* Mini Thumbnails */}
      <div className="flex items-center gap-1.5">
        {compareList.map((p) => (
          <div key={p.id} className="relative group">
            <img
              src={getImageUrl(API_URL, p.image)}
              alt=""
              className="w-9 h-9 rounded-xl object-cover border border-white/20 bg-slate-800"
            />
            <button
              onClick={() => removeFromCompare(p.id)}
              className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-rose-600 text-white flex items-center justify-center text-[10px] opacity-0 group-hover:opacity-100 transition shadow-sm"
              title="Remove"
            >
              ×
            </button>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => setIsCompareOpen(true)}
          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md transition"
        >
          Compare Now
        </button>

        <button
          onClick={clearCompare}
          className="p-2 text-slate-400 hover:text-white rounded-xl transition"
          title="Clear all"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}

export function CompareModal() {
  const { compareList, isCompareOpen, setIsCompareOpen, removeFromCompare, clearCompare } =
    useCompare();

  if (!isCompareOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-6xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-slate-100 dark:border-slate-800 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center">
              <Scale size={20} />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white">
                Property Comparison Matrix
              </h2>
              <p className="text-xs text-slate-400">
                Comparing {compareList.length} properties side by side
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={clearCompare}
              className="text-xs font-semibold text-rose-600 hover:text-rose-700 dark:text-rose-400 transition"
            >
              Clear All
            </button>
            <button
              onClick={() => setIsCompareOpen(false)}
              className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-xl"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="overflow-x-auto p-6 flex-1">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <tbody>
              {/* Row 1: Photos & Titles */}
              <tr className="border-b border-slate-100 dark:border-slate-800">
                <td className="p-4 w-44 font-bold text-xs uppercase tracking-wider text-slate-400">
                  Listing
                </td>
                {compareList.map((p) => (
                  <td key={p.id} className="p-4 align-top min-w-[200px]">
                    <div className="relative rounded-2xl overflow-hidden aspect-video bg-slate-100 mb-3">
                      <img
                        src={getImageUrl(API_URL, p.image)}
                        alt={p.title}
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={() => removeFromCompare(p.id)}
                        className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 text-white hover:bg-rose-600 transition"
                        title="Remove"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                    <Link
                      to={`/properties/${p.id}`}
                      onClick={() => setIsCompareOpen(false)}
                      className="font-bold text-sm text-slate-900 dark:text-white hover:text-blue-600 line-clamp-1 block transition"
                    >
                      {p.title}
                    </Link>
                    <span className="text-xs text-slate-400">{p.city}</span>
                  </td>
                ))}
              </tr>

              {/* Row 2: Price */}
              <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20">
                <td className="p-4 font-bold text-xs uppercase tracking-wider text-slate-400">
                  Price
                </td>
                {compareList.map((p) => (
                  <td key={p.id} className="p-4 font-black text-base text-blue-600 dark:text-blue-400">
                    Rs. {Number(p.price).toLocaleString()}
                  </td>
                ))}
              </tr>

              {/* Row 3: Price per sq.ft */}
              <tr className="border-b border-slate-100 dark:border-slate-800">
                <td className="p-4 font-bold text-xs uppercase tracking-wider text-slate-400">
                  Price / sq.ft
                </td>
                {compareList.map((p) => {
                  const rate = p.area > 0 ? Math.round(Number(p.price) / Number(p.area)) : 0;
                  return (
                    <td key={p.id} className="p-4 text-xs font-bold text-slate-700 dark:text-slate-300">
                      Rs. {rate.toLocaleString()} / sqft
                    </td>
                  );
                })}
              </tr>

              {/* Row 4: Status */}
              <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20">
                <td className="p-4 font-bold text-xs uppercase tracking-wider text-slate-400">
                  Status
                </td>
                {compareList.map((p) => (
                  <td key={p.id} className="p-4">
                    <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600">
                      {p.status || "Available"}
                    </span>
                  </td>
                ))}
              </tr>

              {/* Row 5: Property Type */}
              <tr className="border-b border-slate-100 dark:border-slate-800">
                <td className="p-4 font-bold text-xs uppercase tracking-wider text-slate-400">
                  Category
                </td>
                {compareList.map((p) => (
                  <td key={p.id} className="p-4 text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {p.property_type}
                  </td>
                ))}
              </tr>

              {/* Row 6: Bedrooms & Bathrooms */}
              <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20">
                <td className="p-4 font-bold text-xs uppercase tracking-wider text-slate-400">
                  Bed / Bath
                </td>
                {compareList.map((p) => (
                  <td key={p.id} className="p-4 text-xs font-medium text-slate-700 dark:text-slate-300">
                    {p.bedrooms} Beds • {p.bathrooms} Baths
                  </td>
                ))}
              </tr>

              {/* Row 7: Floor Area */}
              <tr className="border-b border-slate-100 dark:border-slate-800">
                <td className="p-4 font-bold text-xs uppercase tracking-wider text-slate-400">
                  Total Area
                </td>
                {compareList.map((p) => (
                  <td key={p.id} className="p-4 text-xs font-bold text-slate-800 dark:text-slate-200">
                    {p.area} sq.ft
                  </td>
                ))}
              </tr>

              {/* Row 8: Action Link */}
              <tr>
                <td className="p-4 font-bold text-xs uppercase tracking-wider text-slate-400">
                  Action
                </td>
                {compareList.map((p) => (
                  <td key={p.id} className="p-4">
                    <Link
                      to={`/properties/${p.id}`}
                      onClick={() => setIsCompareOpen(false)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-blue-600 text-white text-xs font-semibold transition"
                    >
                      <span>View</span>
                      <ExternalLink size={13} />
                    </Link>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
