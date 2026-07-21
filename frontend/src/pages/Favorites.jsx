import { useEffect, useState } from "react";
import { getFavorites } from "../services/propertyService";
import PropertyCard from "../components/PropertyCard";

function Favorites() {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    loadFavorites();
  }, []);

  async function loadFavorites() {
    try {
      const data = await getFavorites();
      setFavorites(data);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">

      <h1 className="text-4xl font-bold mb-10">
        ❤️ My Favorite Properties
      </h1>

      {favorites.length === 0 ? (
        <h2 className="text-xl text-gray-500">
          No favorite properties yet.
        </h2>
      ) : (
        <div className="grid md:grid-cols-3 gap-8">
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