import Hero from "../components/Hero";
import SearchBar from "../components/SearchBar";
import FeaturedProperties from "../components/FeaturedProperties";
import RecentProperties from "../components/RecentProperties";

function Home() {
  return (
  <>
  <Hero />

  <div className="-mt-16 relative z-20">
    <SearchBar />
  </div>

  <RecentProperties />

  <FeaturedProperties />
</>
  );
}

export default Home;