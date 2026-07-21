import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import PropertyCard from "../components/PropertyCard";
import {
  getProperties,
  searchProperties,
} from "../services/propertyService";

function Properties() {
  const [properties, setProperties] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [searchParams] = useSearchParams();

 useEffect(() => {
  const searchKeyword = searchParams.get("keyword");

  if (searchKeyword) {
    setKeyword(searchKeyword);
    handleSearch(searchKeyword);
  } else {
    loadProperties();
  }
}, [searchParams]);

   async function handleSearch(searchText = keyword) {
      console.log("Button clicked");
      console.log("Keyword:", keyword); 
 if (searchText.trim() === "") {
    loadProperties();
    return;
  }
  try {
    const data = await searchProperties(searchText);
     console.log("Search result:", data);
    setProperties(data);
  } catch (error) {
    console.error(error);
  }
}
  

  async function loadProperties() {
    try {
      const data = await getProperties();
      setProperties(data);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">

      <h1 className="text-4xl font-bold mb-10">
        All Properties
      </h1>
<form
  onSubmit={(e) => {
    e.preventDefault();
    handleSearch();
  }}
  className="flex gap-4 mb-8"
>

  <input
    type="text"
    placeholder="Search by city or title..."
    value={keyword}
    onChange={(e) => setKeyword(e.target.value)}
    className="flex-1 border border-gray-300 rounded-lg px-4 py-3"
  />

 <button
  type="submit"
  className="bg-blue-600 text-white px-6 rounded-lg"
>
    Search
  </button>

</form>
      <div className="grid md:grid-cols-3 gap-8">

        {properties.map((property) => (
          <PropertyCard
            key={property.id}
            property={property}
          />
        ))}

      </div>

    </div>
  );
}

export default Properties;