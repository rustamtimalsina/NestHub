import { useState } from "react";
import { toast } from "react-toastify";
import { forgotPassword } from "../services/userService";

function ForgotPassword() {
  const [email, setEmail] = useState("");

async function handleSubmit(e) {
  e.preventDefault();

  if (!email) {
    toast.error("Please enter your email.");
    return;
  }

  try {
    const data = await forgotPassword(email);

    toast.success(data.message);

  } catch (error) {
    toast.error(
      error.response?.data?.detail || "Something went wrong."
    );
  }
}

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <div className="bg-white p-10 rounded-3xl shadow-xl w-full max-w-md">

        <h1 className="text-3xl font-bold mb-2">
          Forgot Password
        </h1>

        <p className="text-gray-500 mb-8">
          Enter your email and we'll send a password reset link.
        </p>

        <form onSubmit={handleSubmit}>

          <input
            type="email"
            placeholder="Email address"
            className="w-full border rounded-xl p-4 mb-6"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <button
            className="w-full bg-blue-600 text-white rounded-xl py-4"
          >
            Send Reset Link
          </button>

        </form>

      </div>

    </div>
  );
}

export default ForgotPassword;