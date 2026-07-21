import { useEffect, useState } from "react";
import PropertyCard from "./PropertyCard";
import { getProperties } from "../services/propertyService";

function FeaturedProperties() {

  const [properties, setProperties] = useState([]);

  useEffect(() => {
    fetchProperties();
  }, []);

  async function fetchProperties() {

    try {

      const data = await getProperties();

      setProperties(data);

    } catch (error) {

      console.error(error);

    }

  }

  return (
    <section className="bg-gray-100 py-16">

      <div className="max-w-7xl mx-auto px-6">

        <h2 className="text-4xl font-bold text-center mb-10">
          Featured Properties
        </h2>

        <div className="grid md:grid-cols-3 gap-8">

          {properties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
            />
          ))}

        </div>

      </div>

    </section>
  );
}

export default FeaturedProperties;