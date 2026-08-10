import { useEffect, useState } from "react";
import { getRecentProperties } from "../services/propertyService";
import PropertyCard from "./PropertyCard";

function RecentProperties() {
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    async function loadProperties() {
      try {
        const data = await getRecentProperties();
        setProperties(data);
      } catch (error) {
        console.error(error);
      }
    }

    loadProperties();
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <h2 className="text-4xl font-bold text-center mb-3">
        🆕 Recently Added
      </h2>

      <p className="text-center text-gray-500 mb-10">
        Check out the latest available properties.
      </p>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {properties.map((property) => (
          <PropertyCard
            key={property.id}
            property={property}
          />
        ))}
      </div>
    </section>
  );
}

export default RecentProperties;