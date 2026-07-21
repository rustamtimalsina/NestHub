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
    <section className="bg-white py-10 shadow-sm">
      <div className="max-w-5xl mx-auto px-6">

        <h2 className="text-3xl font-bold text-center mb-8">
          Search Properties
        </h2>

        <form
  onSubmit={(e) => {
    e.preventDefault();
    handleSearch();
  }}
  className="flex gap-4"
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
  className="flex-1 border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-blue-600"
/>
 <button
  type="submit"
  className="bg-blue-600 text-white px-8 rounded-lg hover:bg-blue-700"
>
  Search
</button>
        </form>
      </div>
    </section>
  );
}

export default SearchBar;