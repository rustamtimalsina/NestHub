import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../services/userService";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { House, Eye, EyeOff } from "lucide-react";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [loading, setLoading] = useState(false);
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  async function handleRegister(e) {
    e.preventDefault();

    const trimmedName = name.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (trimmedName.length < 3) {
      setNameError("Name must be at least 3 characters.");

      return;
    }

    if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address.");

      return;
    }

    if (!/^\d{10}$/.test(phone)) {
      setPhoneError("Phone number must be exactly 10 digits.");

      return;
    }

    if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters.");

      return;
    }
if (password !== confirmPassword) {
  setConfirmPasswordError("Passwords do not match.");
  return;
}
    setLoading(true);

    try {
      await registerUser({
        name: trimmedName,
        email: email.trim(),
        phone: phone.trim(),
        password,
        role: "user",
      });

      toast.success("Registration successful!");
      setLoading(false);

      setTimeout(() => {
        navigate("/login");
      }, 1000);
    }catch (error) {
  setLoading(false);

  console.error(error);

  const message =
    error.response?.data?.detail || "Registration failed.";

  toast.error(message);
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
              Create your account and start buying, selling and exploring beautiful homes across Nepal.
            </p>
          </div>
        </div>

        <div className="p-10 flex items-center">
          <form onSubmit={handleRegister} className="w-full">
            <div className="text-center mb-10">
              <div className="flex justify-center mb-4">
                <House size={45} className="text-blue-600" />
              </div>

              <h1 className="text-4xl font-black text-gray-800">Create Account</h1>
              <p className="text-gray-500 mt-3">Join NestHub and find your dream home.</p>
            </div>

            <input
  type="text"
              placeholder="Full Name"
              className={`w-full rounded-2xl px-5 py-4 mb-1 focus:outline-none focus:ring-2 ${
                nameError
                  ? "border border-red-500 focus:ring-red-400"
                  : "border border-gray-300 focus:ring-blue-500"
              }`}
              value={name}
             onChange={(e) => {
  setName(e.target.value);
}}
onBlur={() => {
  if (name.trim() === "") {
    setNameError("Full name is required.");
  } else if (name.trim().length < 3) {
    setNameError("Name must be at least 3 characters.");
  } else {
    setNameError("");
  }
}}
            />

            {nameError && <p className="text-red-500 text-sm mb-4">{nameError}</p>}

            <input
              type="email"
              placeholder="Email Address"
              className={`w-full rounded-2xl px-5 py-4 mb-1 focus:outline-none focus:ring-2 ${
                emailError
                  ? "border border-red-500 focus:ring-red-400"
                  : "border border-gray-300 focus:ring-blue-500"
              }`}
              value={email}
           onChange={(e) => {
  const value = e.target.value;
  setEmail(value);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (value === "") {
    setEmailError("Email is required.");
  } else if (!emailRegex.test(value)) {
    setEmailError("Please enter a valid email address.");
  } else {
    setEmailError("");
  }
}}
            />

            {emailError && <p className="text-red-500 text-sm mb-4">{emailError}</p>}

            <input
              type="text"
              placeholder="Phone Number"
              maxLength={10}
              className={`w-full rounded-2xl px-5 py-4 mb-1 focus:outline-none focus:ring-2 ${
                phoneError
                  ? "border border-red-500 focus:ring-red-400"
                  : "border border-gray-300 focus:ring-blue-500"
              }`}
              value={phone}
           onChange={(e) => {
  const value = e.target.value.replace(/\D/g, "");

  setPhone(value);

  if (value === "") {
    setPhoneError("");
  } else if (value.length !== 10) {
    setPhoneError("Phone number must be exactly 10 digits.");
  } else {
    setPhoneError("");
  }
}}
            />

            {phoneError && <p className="text-red-500 text-sm mb-4">{phoneError}</p>}

<div className="relative">
  <input
    type={showPassword ? "text" : "password"}
    placeholder="Password"
    className={`w-full rounded-2xl px-5 py-4 mb-1 focus:outline-none focus:ring-2 ${
      passwordError
        ? "border border-red-500 focus:ring-red-400"
        : "border border-gray-300 focus:ring-blue-500"
    }`}
    value={password}
    onChange={(e) => {
      const value = e.target.value;

      setPassword(value);

      if (value === "") {
        setPasswordError("Password is required.");
      } else if (value.length < 8) {
        setPasswordError("Password must be at least 8 characters.");
      } else {
        setPasswordError("");
      }
    }}
  />


  <button
    type="button"
    onClick={() => setShowPassword(!showPassword)}
    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-600"
  >
    {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
  </button>
</div>

            {passwordError && <p className="text-red-500 text-sm mb-7">{passwordError}</p>}
            <div className="relative">
  <input
    type={showPassword ? "text" : "password"}
    placeholder="Confirm Password"
    className={`w-full rounded-2xl px-5 py-4 mb-1 focus:outline-none focus:ring-2 ${
      confirmPasswordError
        ? "border border-red-500 focus:ring-red-400"
        : "border border-gray-300 focus:ring-blue-500"
    }`}
    value={confirmPassword}
    onChange={(e) => {
      const value = e.target.value;

      setConfirmPassword(value);

      if (value === "") {
        setConfirmPasswordError("");
      } else if (value !== password) {
        setConfirmPasswordError("Passwords do not match.");
      } else {
        setConfirmPasswordError("");
      }
    }}
  />
</div>

{confirmPasswordError && (
  <p className="text-red-500 text-sm mb-7">
    {confirmPasswordError}
  </p>
)}

            <motion.button
              whileHover={!loading ? { scale: 1.03 } : {}}
              whileTap={!loading ? { scale: 0.97 } : {}}
              type="submit"
             disabled={
  loading ||
  !name ||
  !email ||
  !phone ||
  !password ||
  !confirmPassword ||
  nameError ||
  emailError ||
  phoneError ||
  passwordError ||
  confirmPasswordError
}
             className={`w-full py-4 rounded-2xl font-bold shadow-lg transition text-white ${
  loading ||
  !name ||
  !email ||
  !phone ||
  !password ||
  !confirmPassword ||
  nameError ||
  emailError ||
  phoneError ||
  passwordError
    ? "bg-blue-400 cursor-not-allowed"
    : "bg-blue-600 hover:bg-blue-700"
}`}
            >
              {loading ? "Creating Account..." : "Create Account"}
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
