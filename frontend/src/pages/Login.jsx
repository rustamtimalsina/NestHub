import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/userService";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { House } from "lucide-react";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await loginUser(email, password);

      localStorage.setItem("token", data.access_token);

  toast.success("Welcome back!");
setLoading(false);
setTimeout(() => {

  navigate("/");
  window.location.reload();
}, 1000);
    } catch (error) {
      setLoading(false);
      toast.error("Invalid email or password.");
      console.error(error);
    }
  }

 return (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center px-6">

    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      className="grid md:grid-cols-2 bg-white rounded-[32px] shadow-2xl overflow-hidden max-w-6xl w-full"
    >

      {/* Left Side */}

      <div className="hidden md:block relative">

        <img
          src="/images/hero.jpg"
          alt="House"
          className="w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-blue-900/40"></div>

        <div className="absolute bottom-10 left-10 text-white">

          <h2 className="text-5xl font-black leading-tight">
            Find Your
            <br />
            Dream Home
          </h2>

          <p className="mt-4 text-lg">
            Buy, Rent and Sell properties across Nepal.
          </p>

        </div>

      </div>

      {/* Right Side */}

      <div className="p-10 flex items-center">

        <form
          onSubmit={handleLogin}
          className="w-full"
        >

          <div className="text-center mb-10">

            <div className="flex justify-center mb-4">

              <House
                size={45}
                className="text-blue-600"
              />

            </div>

            <h1 className="text-4xl font-black text-gray-800">
              Welcome Back
            </h1>

            <p className="text-gray-500 mt-3">
              Login to continue searching your dream home.
            </p>

          </div>

          <input
            type="email"
            placeholder="Email Address"
            className="w-full border border-gray-300 rounded-2xl px-5 py-4 mb-5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full border border-gray-300 rounded-2xl px-5 py-4 mb-7 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <p
  onClick={() => navigate("/forgot-password")}
  className="text-right text-blue-600 cursor-pointer hover:underline mb-6"
>
  Forgot Password?
</p>

         <motion.button
  whileHover={!loading ? { scale: 1.03 } : {}}
  whileTap={!loading ? { scale: 0.97 } : {}}
  type="submit"
  disabled={loading}
  className={`w-full py-4 rounded-2xl font-bold shadow-lg transition text-white ${
    loading
      ? "bg-blue-400 cursor-not-allowed"
      : "bg-blue-600 hover:bg-blue-700"
  }`}
>
  {loading ? "Logging in..." : "Login"}
</motion.button>

          <p className="text-center mt-8 text-gray-600">

            Don't have an account?{" "}

            <span
              onClick={() => navigate("/register")}
              className="text-blue-600 font-bold cursor-pointer hover:underline"
            >
              Register
            </span>

          </p>

        </form>

      </div>

    </motion.div>

  </div>
);
}

export default Login;
