import { useState } from "react";
import { useNavigate } from "react-router-dom";
function SearchBar() {
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();
  const handleSearch = () => {
  console.log("Searching:", keyword);

  if (keyword.trim() !== "") {
    navigate(`/properties?keyword=${keyword}`);
  }
};
  return (
    <section className="max-w-5xl mx-auto px-6">
      <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">

       <h2 className="text-4xl font-bold text-center mb-3">
  Find Your Dream Property
</h2>

<p className="text-center text-gray-500 mb-8">
  Search thousands of verified properties across Nepal.
</p>

        <form
  onSubmit={(e) => {
    e.preventDefault();
    handleSearch();
  }}
  className="flex flex-col md:flex-row gap-4"
>
   <input
  type="text"
  placeholder="Search by city or title..."
  value={keyword}
  onChange={(e) => setKeyword(e.target.value)}
  onKeyDown={(e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  }}
 className="flex-1 rounded-2xl border border-gray-200 bg-gray-50 px-6 py-4 text-lg outline-none transition-all duration-300 focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
/>
 <button
  type="submit"
 className="bg-blue-600 hover:bg-blue-700 text-white px-10 rounded-2xl font-semibold shadow-lg transition-all duration-300 hover:scale-105"
>
  Search
</button>
        </form>
      </div>
    </section>
  );
}

export default SearchBar;