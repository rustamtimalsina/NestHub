import Hero from "../components/Hero";
import SearchBar from "../components/SearchBar";
import FeaturedProperties from "../components/FeaturedProperties";

function Home() {
  return (
   <>
  <Hero />

  <div className="-mt-16 relative z-20">
    <SearchBar />
  </div>

  <FeaturedProperties />
</>
  );
}

export default Home;