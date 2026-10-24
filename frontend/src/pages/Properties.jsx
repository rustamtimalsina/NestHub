import { useSearchParams } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import PropertyCard from "../components/PropertyCard";
import { PropertyCardSkeleton } from "../components/Skeleton";
import {
  getProperties,
  getCities,
  getPropertyTypes,
} from "../services/propertyService";
import {
  Search,
  Filter,
  X,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
} from "lucide-react";

function Properties() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Read state from URL search params
  const keywordParam = searchParams.get("keyword") || "";
  const cityParam = searchParams.get("city") || "";
  const typeParam = searchParams.get("type") || "";
  const sortParam = searchParams.get("sort") || "newest";
  const minPriceParam = searchParams.get("min_price") || "";
  const maxPriceParam = searchParams.get("max_price") || "";
  const pageParam = parseInt(searchParams.get("page") || "1", 10);

  const [properties, setProperties] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [cities, setCities] = useState([]);
  const [propertyTypes, setPropertyTypes] = useState([]);

  const [keywordInput, setKeywordInput] = useState(keywordParam);

  // Load filter options (cities & property types) once
  useEffect(() => {
    let active = true;
    async function loadOptions() {
      try {
        const [c, t] = await Promise.all([getCities(), getPropertyTypes()]);
        if (active) {
          setCities(c || []);
          setPropertyTypes(t || []);
        }
      } catch (err) {
        console.error("Failed to load filter options", err);
      }
    }
    loadOptions();
    return () => {
      active = false;
    };
  }, []);

  // Update URL search parameters
  const updateParams = useCallback(
    (newParams) => {
      const current = Object.fromEntries(searchParams.entries());
      const updated = { ...current, ...newParams };

      // Clean empty keys
      Object.keys(updated).forEach((k) => {
        if (!updated[k] || updated[k] === "") {
          delete updated[k];
        }
      });

      setSearchParams(updated);
    },
    [searchParams, setSearchParams]
  );

  // Fetch properties whenever search parameters change
  useEffect(() => {
    let active = true;

    async function fetchData() {
      try {
        setLoading(true);
        setError("");

        const result = await getProperties({
          page: pageParam,
          limit: 9,
          sort: sortParam,
          city: cityParam,
          propertyType: typeParam,
          minPrice: minPriceParam,
          maxPrice: maxPriceParam,
        });

        if (active) {
          let list = result.properties || [];
          if (keywordParam) {
            const kw = keywordParam.toLowerCase();
            list = list.filter(
              (p) =>
                p.title.toLowerCase().includes(kw) ||
                p.city.toLowerCase().includes(kw) ||
                p.property_type.toLowerCase().includes(kw)
            );
          }
          setProperties(list);
          setTotalPages(result.total_pages || 1);
          setTotalItems(result.total || list.length);
        }
      } catch (err) {
        console.error(err);
        if (active) {
          setError("Unable to load properties. Please try again.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    fetchData();
    return () => {
      active = false;
    };
  }, [
    pageParam,
    sortParam,
    cityParam,
    typeParam,
    minPriceParam,
    maxPriceParam,
    keywordParam,
  ]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateParams({ keyword: keywordInput.trim(), page: 1 });
  };

  const clearAllFilters = () => {
    setKeywordInput("");
    setSearchParams({});
  };

  const hasActiveFilters = Boolean(
    keywordParam ||
      cityParam ||
      typeParam ||
      minPriceParam ||
      maxPriceParam ||
      (sortParam && sortParam !== "newest")
  );

  return (
    <div className="min-h-screen bg-slate-50/60 pb-20">
      {/* Top Banner */}
      <div className="bg-white border-b border-slate-100 py-10 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                Explore Properties
              </h1>
              <p className="text-slate-500 text-sm mt-1.5">
                Browse verified residential, commercial, and land listings across Nepal.
              </p>
            </div>

            {/* Quick Keyword Search Form */}
            <form
              onSubmit={handleSearchSubmit}
              className="relative flex items-center w-full md:w-96"
            >
              <Search
                size={18}
                className="absolute left-4 text-slate-400 pointer-events-none"
              />
              <input
                type="text"
                placeholder="Search city, neighborhood, title..."
                value={keywordInput}
                onChange={(e) => setKeywordInput(e.target.value)}
                className="w-full pl-11 pr-24 py-3 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100 outline-none text-sm transition"
              />
              <button
                type="submit"
                className="absolute right-2 px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition"
              >
                Search
              </button>
            </form>
          </div>

          {/* Filter Bar */}
          <div className="mt-8 pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              {/* City Filter */}
              <select
                value={cityParam}
                onChange={(e) => updateParams({ city: e.target.value, page: 1 })}
                className="px-4 py-2 rounded-xl bg-slate-100 border border-slate-200/80 text-xs font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                <option value="">All Locations</option>
                {cities.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>

              {/* Property Type Filter */}
              <select
                value={typeParam}
                onChange={(e) => updateParams({ type: e.target.value, page: 1 })}
                className="px-4 py-2 rounded-xl bg-slate-100 border border-slate-200/80 text-xs font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                <option value="">All Types</option>
                {propertyTypes.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>

              {/* Price Range Presets */}
              <select
                value={
                  minPriceParam === "0" && maxPriceParam === "5000000"
                    ? "under-5m"
                    : minPriceParam === "5000000" && maxPriceParam === "20000000"
                    ? "5m-20m"
                    : minPriceParam === "20000000"
                    ? "above-20m"
                    : ""
                }
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === "under-5m") {
                    updateParams({ min_price: "0", max_price: "5000000", page: 1 });
                  } else if (val === "5m-20m") {
                    updateParams({ min_price: "5000000", max_price: "20000000", page: 1 });
                  } else if (val === "above-20m") {
                    updateParams({ min_price: "20000000", max_price: "", page: 1 });
                  } else {
                    updateParams({ min_price: "", max_price: "", page: 1 });
                  }
                }}
                className="px-4 py-2 rounded-xl bg-slate-100 border border-slate-200/80 text-xs font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                <option value="">Any Price</option>
                <option value="under-5m">Under Rs. 50 Lakhs</option>
                <option value="5m-20m">Rs. 50 Lakhs – Rs. 2 Crore</option>
                <option value="above-20m">Above Rs. 2 Crore</option>
              </select>

              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className="flex items-center gap-1 px-3 py-2 text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-xl transition"
                >
                  <RotateCcw size={13} />
                  Reset Filters
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-medium">Sort by:</span>
              <select
                value={sortParam}
                onChange={(e) => updateParams({ sort: e.target.value, page: 1 })}
                className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer shadow-xs"
              >
                <option value="newest">Newest Listed</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-6 mt-8">
        <div className="flex items-center justify-between mb-6">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Showing {properties.length} of {totalItems} {totalItems === 1 ? "property" : "properties"}
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <PropertyCardSkeleton key={i} />
            ))}
          </div>
        ) : error ? (
          <div className="bg-white rounded-3xl p-12 text-center max-w-lg mx-auto border border-rose-100 shadow-sm">
            <h2 className="text-xl font-bold text-rose-600">Error Loading Properties</h2>
            <p className="text-slate-500 text-sm mt-2">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-6 px-6 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition"
            >
              Retry
            </button>
          </div>
        ) : properties.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {properties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-12">
                <button
                  disabled={pageParam <= 1}
                  onClick={() => updateParams({ page: pageParam - 1 })}
                  className="p-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:pointer-events-none transition shadow-xs"
                >
                  <ChevronLeft size={18} />
                </button>

                {Array.from({ length: totalPages }).map((_, idx) => {
                  const pNum = idx + 1;
                  return (
                    <button
                      key={pNum}
                      onClick={() => updateParams({ page: pNum })}
                      className={`w-10 h-10 rounded-xl text-sm font-bold transition shadow-xs ${
                        pageParam === pNum
                          ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                          : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      {pNum}
                    </button>
                  );
                })}

                <button
                  disabled={pageParam >= totalPages}
                  onClick={() => updateParams({ page: pageParam + 1 })}
                  className="p-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:pointer-events-none transition shadow-xs"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="bg-white rounded-3xl p-16 text-center max-w-lg mx-auto border border-slate-100 shadow-sm">
            <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
              <Search size={28} />
            </div>
            <h2 className="text-xl font-bold text-slate-800">
              No Properties Found
            </h2>
            <p className="text-slate-500 text-sm mt-2">
              We couldn't find any property matching your active filters or keyword.
            </p>
            <button
              onClick={clearAllFilters}
              className="mt-6 px-6 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-blue-600 transition"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Properties;
