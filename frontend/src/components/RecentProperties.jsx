import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getRecentProperties } from "../services/propertyService";
import PropertyCard from "./PropertyCard";
import { PropertyCardSkeleton } from "./Skeleton";
import { Sparkles, ArrowRight } from "lucide-react";

function RecentProperties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProperties() {
      try {
        const data = await getRecentProperties();
        setProperties(data || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadProperties();
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-6 py-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles size={14} />
            <span>Fresh Listings</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Recently Added Properties
          </h2>
          <p className="text-slate-500 text-sm mt-1.5">
            Discover the newest homes, apartments, and land available right now.
          </p>
        </div>

        <Link
          to="/properties"
          className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700 transition group"
        >
          <span>Explore All Properties</span>
          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 3 }).map((_, i) => (
            <PropertyCardSkeleton key={i} />
          ))}
        </div>
      ) : properties.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      ) : (
        <p className="text-center text-slate-400 py-12">No recent properties available.</p>
      )}
    </section>
  );
}

export default RecentProperties;
