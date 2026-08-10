import { useEffect, useState } from "react";
import { getFavorites } from "../services/propertyService";
import PropertyCard from "../components/PropertyCard";
import { useNavigate } from "react-router-dom";

function Favorites() {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    let active = true;

    async function loadFavorites() {
      try {
        const data = await getFavorites();
        if (active) setFavorites(data);
      } catch (error) {
        console.error(error);
      }
    }

    loadFavorites();
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="mb-10">
        <h1 className="text-3xl sm:text-5xl font-black">
          ❤️ My Favorites
        </h1>

        <p className="text-gray-500 mt-3">
          You have <span className="font-bold text-blue-600">{favorites.length}</span> favorite {favorites.length === 1 ? "property" : "properties"}.
        </p>
      </div>

      {favorites.length === 0 ? (
        <div className="text-center py-24">
          <h2 className="text-3xl font-bold mb-4">
            ❤️ No Favorites Yet
          </h2>

          <p className="text-gray-500 mb-8">
            Save properties you love and they'll appear here.
          </p>

          <button
            onClick={() => navigate("/properties")}
            className="bg-blue-600 hover:bg-blue-700 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-white px-8 py-3 rounded-xl font-semibold"
          >
            Browse Properties
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
          {favorites.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Favorites;
