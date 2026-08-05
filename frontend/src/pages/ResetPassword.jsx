import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { resetPassword } from "../services/userService";

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  async function handleReset() {

  if (password.length < 8) {
    toast.error("Password must be at least 8 characters.");
    return;
  }

  setLoading(true);

  try {

    const data = await resetPassword(
      token,
      password
    );

    toast.success(data.message);

    setTimeout(() => {
      navigate("/login");
    }, 1500);

  } catch (error) {

    toast.error(
      error.response?.data?.detail || "Something went wrong."
    );

  } finally {

    setLoading(false);

  }
}
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <div className="bg-white p-10 rounded-3xl shadow-xl w-full max-w-md">

        <h1 className="text-3xl font-bold mb-2">
          Reset Password
        </h1>

        <p className="text-gray-500 mb-6">
          Enter your new password.
        </p>

        <input
          type="password"
          placeholder="New Password"
          className="w-full border rounded-xl p-4 mb-6"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
  onClick={handleReset}
  disabled={loading}
  className="w-full bg-blue-600 text-white rounded-xl py-4 disabled:bg-blue-300"
>
  {loading ? "Updating..." : "Reset Password"}
</button>

      </div>

    </div>
  );
}

export default ResetPassword;