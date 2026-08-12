import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import PropertyCard from "../components/PropertyCard";
import {
  getProperties,
  searchProperties,
} from "../services/propertyService";

function Properties() {
  const [properties, setProperties] = useState([]);
const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const searchKeyword = searchParams.get("keyword") || "";
  const [keyword, setKeyword] = useState(searchKeyword);

  useEffect(() => {
    let active = true;

    async function loadResults() {
      try {
        setLoading(true);
        const data = searchKeyword
          ? await searchProperties(searchKeyword)
          : await getProperties();
        if (active) setProperties(searchKeyword ? data : data.properties);
      } catch (error) {
        console.error(error);
     } finally {
    if (active) {
      setLoading(false);
    }
  }
}

    loadResults();
    return () => {
      active = false;
    };
  }, [searchKeyword]);

   async function handleSearch(searchText = keyword) {
  console.log("Button clicked");
  console.log("Keyword:", keyword);

  if (searchText.trim() === "") {
    loadProperties();
    return;
  }

  try {
    setLoading(true);

    const data = await searchProperties(searchText);
    console.log("Search result:", data);

    setProperties(data);
  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
  }
}
  

  async function loadProperties() {
  try {
    setLoading(true);

    const data = await getProperties();
    setProperties(data.properties);
  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
  }
}

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">

      <div className="mb-10">

  <h1 className="text-3xl sm:text-5xl font-black text-gray-900">
    Explore Properties
  </h1>

  <p className="mt-3 text-gray-500 text-lg">
    Browse verified homes and find the perfect property for you.
  </p>

</div>
<form
  onSubmit={(e) => {
    e.preventDefault();
    handleSearch();
  }}
  className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4 mb-10 flex flex-col sm:flex-row gap-4"
>

  <input
    type="text"
    placeholder="Search by city or property title..."
    value={keyword}
    onChange={(e) => setKeyword(e.target.value)}
    className="flex-1 rounded-xl border border-gray-300 px-5 py-3 outline-none focus:ring-2 focus:ring-blue-500"
  />

  <button
    type="submit"
    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold transition"
  >
    🔍 Search
  </button>

</form>
     {loading ? (
  <div className="text-center py-20">
    <p className="text-gray-500 text-lg">
      Loading properties...
    </p>
  </div>
) : properties.length > 0 ? (

  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">

    {properties.map((property) => (
      <PropertyCard
        key={property.id}
        property={property}
      />
    ))}

  </div>

) : (

  <div className="bg-white rounded-3xl shadow-lg border border-gray-200 py-20 text-center">

    <h2 className="text-3xl font-bold text-gray-700">
      😕 No Properties Found
    </h2>

    <p className="text-gray-500 mt-3">
      Try searching with another city or property title.
    </p>

    <button
      onClick={() => {
        setKeyword("");
        loadProperties();
      }}
      className="mt-8 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold transition"
    >
      View All Properties
    </button>

  </div>

)}

    </div>
  );
}

export default Properties;
