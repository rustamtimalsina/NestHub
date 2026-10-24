import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getFavorites } from "../services/propertyService";
import PropertyCard from "../components/PropertyCard";
import { PropertyCardSkeleton } from "../components/Skeleton";
import { Heart, Compass } from "lucide-react";

function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadFavorites() {
      try {
        setLoading(true);
        const data = await getFavorites();
        if (active) setFavorites(data || []);
      } catch (error) {
        console.error(error);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadFavorites();
    return () => {
      active = false;
    };
  }, []);

  const handleFavoriteToggle = (propId, isFav) => {
    if (!isFav) {
      setFavorites((prev) => prev.filter((p) => p.id !== propId));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/60 py-10 px-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-50 text-rose-600">
            Saved Listings
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-2">
            My Favorite Properties
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            You have{" "}
            <span className="font-bold text-rose-600">{favorites.length}</span>{" "}
            saved {favorites.length === 1 ? "listing" : "listings"}.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 3 }).map((_, i) => (
              <PropertyCardSkeleton key={i} />
            ))}
          </div>
        ) : favorites.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center max-w-lg mx-auto border border-slate-100 shadow-xs">
            <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center mx-auto mb-4">
              <Heart size={28} />
            </div>
            <h2 className="text-xl font-bold text-slate-800">No Favorites Yet</h2>
            <p className="text-slate-500 text-sm mt-2">
              Save properties you love while browsing to easily compare and review them later.
            </p>
            <Link
              to="/properties"
              className="inline-flex items-center gap-2 mt-6 px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-sm transition"
            >
              <Compass size={16} />
              Browse Properties
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {favorites.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                initialFavorite={true}
                onFavoriteToggle={handleFavoriteToggle}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Favorites;
