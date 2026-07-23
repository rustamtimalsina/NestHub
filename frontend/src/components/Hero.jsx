import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function Hero() {
    const navigate = useNavigate();
  return (
   <motion.section
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.8 }}
  className="relative min-h-[90vh] bg-gradient-to-br from-blue-50 via-white to-blue-100 overflow-hidden"
>
      <div className="max-w-7xl mx-auto px-8 py-28 flex flex-col-reverse md:flex-row items-center justify-between gap-16">

        {/* Left Side */}
        <motion.div
  className="md:w-1/2"
  initial={{ opacity: 0, x: -80 }}
  animate={{ opacity: 1, x: 0 }}
  transition={{ duration: 0.8, delay: 0.2 }}
>

          <h1 className="text-6xl md:text-7xl font-black leading-tight tracking-tight">
            Find Your
            <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent"> Dream Home</span>
          </h1>

          <p className="mt-8 text-xl text-gray-600 leading-9 max-w-xl">
            Discover thousands of verified properties across Nepal.
            Buy, rent, and sell with confidence.
          </p>

     <motion.button
  onClick={() => navigate("/properties")}
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  className="mt-10 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl text-lg font-semibold shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
>
  Explore Properties
</motion.button>

       </motion.div>

        {/* Right Side */}
       <motion.div
  className="md:w-1/2 flex justify-center mt-10 md:mt-0"
  initial={{ opacity: 0, x: 80, scale: 0.9 }}
  animate={{ opacity: 1, x: 0, scale: 1 }}
  transition={{ duration: 0.9, delay: 0.3 }}
>

  <div className="relative">

    <img
      src="/images/hero.jpg"
      alt="Luxury House"
      className="w-[560px] h-[420px] object-cover rounded-[40px] shadow-2xl"
    />

    <div className="absolute -bottom-6 -left-6 bg-white rounded-3xl shadow-xl px-6 py-4">
      <p className="text-gray-500 text-sm">Premium Listings</p>
      <h2 className="text-3xl font-bold text-blue-600">500+</h2>
    </div>

    <div className="absolute -top-6 -right-6 bg-white rounded-3xl shadow-xl px-6 py-4">
      <p className="text-gray-500 text-sm">Happy Clients</p>
      <h2 className="text-2xl font-bold">⭐ 4.9</h2>
    </div>

  

</div>
</motion.div>

      </div>
    </motion.section>
  );
}

export default Hero;