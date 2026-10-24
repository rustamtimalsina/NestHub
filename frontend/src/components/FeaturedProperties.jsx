import { useEffect, useState } from "react";
import PropertyCard from "./PropertyCard";
import { PropertyCardSkeleton } from "./Skeleton";
import {
  getProperties,
  getCities,
  getPropertyTypes,
} from "../services/propertyService";
import { ChevronLeft, ChevronRight, SlidersHorizontal, Compass } from "lucide-react";

function FeaturedProperties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const [city, setCity] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [cities, setCities] = useState([]);
  const [propertyTypes, setPropertyTypes] = useState([]);

  useEffect(() => {
    let active = true;

    async function loadProperties() {
      try {
        setLoading(true);
        setError("");

        const data = await getProperties({
          page,
          limit: 6,
          sort,
          city,
          propertyType,
        });

        if (active) {
          setProperties(data.properties || []);
          setTotalPages(data.total_pages || 1);
        }
      } catch (err) {
        console.error(err);
        if (active) setError("Unable to load properties.");
      } finally {
        if (active) setLoading(false);
      }
    }

    loadProperties();
    return () => {
      active = false;
    };
  }, [page, sort, city, propertyType]);

  useEffect(() => {
    let active = true;

    async function loadFilters() {
      try {
        const [cityData, typeData] = await Promise.all([
          getCities(),
          getPropertyTypes(),
        ]);
        if (active) {
          setCities(cityData || []);
          setPropertyTypes(typeData || []);
        }
      } catch (err) {
        console.error(err);
      }
    }

    loadFilters();
    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="bg-slate-100/70 py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-wider mb-2">
              <Compass size={14} />
              <span>Catalog</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Featured Listings Across Nepal
            </h2>
            <p className="text-slate-500 text-sm mt-1.5">
              Handpicked premium residences, commercial properties, and land.
            </p>
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap items-center gap-3">
            <select
              value={city}
              onChange={(e) => {
                setCity(e.target.value);
                setPage(1);
              }}
              className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 shadow-xs cursor-pointer"
            >
              <option value="">All Locations</option>
              {cities.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            <select
              value={propertyType}
              onChange={(e) => {
                setPropertyType(e.target.value);
                setPage(1);
              }}
              className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 shadow-xs cursor-pointer"
            >
              <option value="">All Categories</option>
              {propertyTypes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>

            <select
              value={sort}
              onChange={(e) => {
                setSort(e.target.value);
                setPage(1);
              }}
              className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 shadow-xs cursor-pointer"
            >
              <option value="newest">Newest Listed</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <PropertyCardSkeleton key={i} />
            ))}
          </div>
        ) : error ? (
          <div className="p-8 text-center text-rose-500 bg-white rounded-3xl border border-rose-100">
            {error}
          </div>
        ) : properties.length > 0 ? (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {properties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-12">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="p-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:pointer-events-none transition shadow-xs"
                >
                  <ChevronLeft size={18} />
                </button>

                {Array.from({ length: totalPages }).map((_, idx) => {
                  const pNum = idx + 1;
                  return (
                    <button
                      key={pNum}
                      onClick={() => setPage(pNum)}
                      className={`w-10 h-10 rounded-xl text-sm font-bold transition shadow-xs ${
                        page === pNum
                          ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                          : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      {pNum}
                    </button>
                  );
                })}

                <button
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="p-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:pointer-events-none transition shadow-xs"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center text-slate-500 max-w-md mx-auto">
            No properties found matching the selected filters.
          </div>
        )}
      </div>
    </section>
  );
}

export default FeaturedProperties;
