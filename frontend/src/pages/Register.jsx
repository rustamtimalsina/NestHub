import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../services/userService";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { House } from "lucide-react";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
 const [email, setEmail] = useState("");
const [phone, setPhone] = useState("");
const [password, setPassword] = useState("");

  async function handleRegister(e) {
    e.preventDefault();

    try {
      await registerUser({
        name,
        email,
        phone,
        password,
        role: "user",
      });

     toast.success("Registration successful!");

      navigate("/login");
    } catch (error) {
      console.error(error);
      toast.error("Registration failed.");
    }
  }

 return (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center px-6">

    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
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
            Join
            <br />
            NestHub
          </h2>

          <p className="mt-4 text-lg max-w-sm">
            Create your account and start buying, selling and exploring
            beautiful homes across Nepal.
          </p>

        </div>

      </div>

      {/* Right Side */}

      <div className="p-10 flex items-center">

        <form
          onSubmit={handleRegister}
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
              Create Account
            </h1>

            <p className="text-gray-500 mt-3">
              Join NestHub and find your dream home.
            </p>

          </div>

          <input
            type="text"
            placeholder="Full Name"
            className="w-full border border-gray-300 rounded-2xl px-5 py-4 mb-5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            type="email"
            placeholder="Email Address"
            className="w-full border border-gray-300 rounded-2xl px-5 py-4 mb-5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="text"
            placeholder="Phone Number"
            className="w-full border border-gray-300 rounded-2xl px-5 py-4 mb-5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full border border-gray-300 rounded-2xl px-5 py-4 mb-7 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-bold shadow-lg transition"
          >
            Create Account
          </motion.button>

          <p className="text-center mt-8 text-gray-600">

            Already have an account?{" "}

            <span
              onClick={() => navigate("/login")}
              className="text-blue-600 font-bold cursor-pointer hover:underline"
            >
              Login
            </span>

          </p>

        </form>

      </div>

    </motion.div>

  </div>
);
}

export default Register;