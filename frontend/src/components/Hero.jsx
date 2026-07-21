import { useNavigate } from "react-router-dom";

function Hero() {
    const navigate = useNavigate();
  return (
    <section className="bg-gray-100">
      <div className="max-w-7xl mx-auto px-8 py-24 flex flex-col md:flex-row items-center justify-between">

        {/* Left Side */}
        <div className="md:w-1/2">

          <h1 className="text-5xl font-extrabold leading-tight">
            Find Your
            <span className="text-blue-600"> Dream Home</span>
          </h1>

          <p className="mt-6 text-lg text-gray-600">
            Discover thousands of verified properties across Nepal.
            Buy, rent, and sell with confidence.
          </p>

         <button
  onClick={() => navigate("/properties")}
  className="mt-8 bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition"
>
  Explore Properties
</button>
        </div>

        {/* Right Side */}
        <div className="md:w-1/2 flex justify-center mt-10 md:mt-0">

          <div className="w-96 h-72 bg-blue-100 rounded-3xl flex items-center justify-center text-8xl shadow-lg">
            🏡
          </div>

        </div>

      </div>
    </section>
  );
}

export default Hero;