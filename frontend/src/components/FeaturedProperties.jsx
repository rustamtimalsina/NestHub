import { useEffect, useState } from "react";
import PropertyCard from "./PropertyCard";
import {
  getProperties,
  getCities,
  getPropertyTypes
} from "../services/propertyService";

function FeaturedProperties() {
  console.log("FeaturedProperties rendered");

  const [properties, setProperties] = useState([]);
const [totalPages, setTotalPages] = useState(1);
 const [sort, setSort] = useState("newest");
  const [city, setCity] = useState("");
const [propertyType, setPropertyType] = useState("");
const [cities, setCities] = useState([]);
const [propertyTypes, setPropertyTypes] = useState([]);

  useEffect(() => {
    let active = true;

    async function loadProperties() {
      try {
        const data = await getProperties(1, sort, city, propertyType);
        if (active) {
         setProperties(data.properties.slice(0, 6));
          setTotalPages(data.total_pages);
        }
      } catch (error) {
        console.error(error);
      }
    }

    loadProperties();
    return () => {
      active = false;
    };
  }, [sort, city, propertyType]);

  useEffect(() => {
    let active = true;

    async function loadFilters() {
      try {
        const [cityData, typeData] = await Promise.all([
          getCities(),
          getPropertyTypes(),
        ]);
        if (active) {
          setCities(cityData);
          setPropertyTypes(typeData);
        }
      } catch (error) {
        console.error(error);
      }
    }

    loadFilters();
    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="bg-gray-100 py-16">
      <div className="max-w-7xl mx-auto px-6">

        <h2 className="text-4xl font-bold text-center mb-10">
         🏡 Browse All Properties
        </h2>
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">

  <div className="flex gap-4 flex-wrap">

   <select
  value={city}
  onChange={(e) => {
    setCity(e.target.value);
    setPage(1);
  }}
  className="border rounded-lg px-4 py-2 shadow-sm"
>
  <option value="">All Cities</option>

  {cities.map((city) => (
    <option key={city} value={city}>
      {city}
    </option>
  ))}
</select>

  <select
  value={propertyType}
  onChange={(e) => {
    setPropertyType(e.target.value);
    setPage(1);
  }}
  className="border rounded-lg px-4 py-2 shadow-sm"
>
  <option value="">All Types</option>

  {propertyTypes.map((type) => (
    <option key={type} value={type}>
      {type}
    </option>
  ))}
</select>

  </div>

  <select
    value={sort}
    onChange={(e) => {
      setSort(e.target.value);
      setPage(1);
    }}
    className="border rounded-lg px-4 py-2 shadow-sm"
  >
    <option value="newest">Newest</option>
    <option value="oldest">Oldest</option>
    <option value="price_low">Price: Low → High</option>
    <option value="price_high">Price: High → Low</option>
  </select>

</div>

        <div className="grid md:grid-cols-3 gap-8">
          {properties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
            />
          ))}
        </div>
<div className="flex justify-center mt-12">
  <a
    href="/properties"
    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold transition shadow-lg hover:shadow-xl"
  >
    View All Properties →
  </a>
</div>

      </div>
    </section>
  );
}

export default FeaturedProperties;
