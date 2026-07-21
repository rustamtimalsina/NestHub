import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/userService";
import { toast } from "react-toastify";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin(e) {
    e.preventDefault();

    try {
      const data = await loginUser(email, password);

      localStorage.setItem("token", data.access_token);

  toast.success("Welcome back!");

setTimeout(() => {
  navigate("/");
  window.location.reload();
}, 1000);
      navigate("/");
    } catch (error) {
      toast.error("Invalid email or password.");
      console.error(error);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md"
      >
        <div className="text-center mb-8">

  <h1 className="text-4xl font-bold text-blue-600">
    🏡 NestHub
  </h1>

  <h2 className="text-2xl font-semibold mt-4">
    Welcome Back
  </h2>

  <p className="text-gray-500 mt-2">
    Login to continue searching your dream home.
  </p>

</div>
<input
  type="email"
  placeholder="Enter your email"
  className="w-full border border-gray-300 p-3 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
/>

     <input
  type="password"
  placeholder="Enter your password"
  className="w-full border border-gray-300 p-3 rounded-lg mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
/>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-200 font-semibold"
        >
          Login
        </button>
<p className="text-center text-gray-600 mt-6">
  Don't have an account?{" "}
  <span
    onClick={() => navigate("/register")}
    className="text-blue-600 font-semibold cursor-pointer hover:underline"
  >
    Register
  </span>
</p>
      </form>

    </div>
  );
}

export default Login;