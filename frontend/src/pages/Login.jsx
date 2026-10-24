import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link, useLocation } from "react-router-dom";
import { loginUser, resendVerification } from "../services/userService";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { House, Lock, Mail, ArrowRight } from "lucide-react";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();
  const [searchParams] = useSearchParams();
  const [needsVerification, setNeedsVerification] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      const destination = location.state?.from?.pathname || "/";
      navigate(destination, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  useEffect(() => {
    const status = searchParams.get("verified");

    if (status === "1") {
      toast.success("Email verified! You can now log in.");
    } else if (status === "expired" || status === "invalid") {
      setNeedsVerification(true);
      toast.error(
        "That verification link is invalid or has expired. Enter your email below and request a new one."
      );
    }
  }, [searchParams]);

  async function handleResend() {
    if (!email.trim()) {
      toast.error("Enter your email address first.");
      return;
    }

    try {
      await resendVerification(email.trim());
      toast.success("If that account needs verifying, a new link has been sent.");
    } catch (error) {
      if (error.response?.status === 429) {
        toast.error("Too many attempts. Please wait a minute and try again.");
      } else {
        toast.error(
          error.response?.data?.detail || "Could not send the email."
        );
      }
    }
  }

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await loginUser(email.trim(), password);
      await login(data.access_token);
      toast.success("Welcome back!");
      const destination = location.state?.from?.pathname || "/";
      navigate(destination, { replace: true });
    } catch (error) {
      setLoading(false);

      if (error.response?.status === 429) {
        toast.error("Too many attempts. Please wait a minute and try again.");
      } else if (error.response?.status === 403) {
        setNeedsVerification(true);
        toast.error(
          error.response?.data?.detail ||
            "Please verify your email before logging in."
        );
      } else {
        toast.error("Invalid email or password.");
      }
    }
  }

  return (
    <div className="min-h-[85vh] bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 flex items-center justify-center px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="grid md:grid-cols-2 bg-white rounded-3xl shadow-xl overflow-hidden max-w-5xl w-full border border-slate-100"
      >
        {/* Left Side Imagery */}
        <div className="hidden md:block relative bg-slate-900">
          <img
            src="/images/hero.jpg"
            alt="NestHub Luxury Property"
            className="w-full h-full object-cover opacity-85"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
          <div className="absolute bottom-10 left-10 right-10 text-white">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold mb-4">
              <House size={14} />
              <span>Premium Living across Nepal</span>
            </div>
            <h2 className="text-3xl font-black leading-tight">
              Discover your next sanctuary with NestHub.
            </h2>
            <p className="text-slate-300 text-sm mt-3 leading-relaxed">
              Verified residential listings, trusted landlords, direct owner communication.
            </p>
          </div>
        </div>

        {/* Right Side Form */}
        <div className="p-8 sm:p-12 flex flex-col justify-center">
          <div className="mb-8">
            <h1 className="text-3xl font-black text-slate-900">Welcome Back</h1>
            <p className="text-slate-500 mt-2 text-sm">
              Enter your credentials to access your NestHub account.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 focus:border-blue-600 focus:ring-4 focus:ring-blue-100 outline-none transition text-sm text-slate-800"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 focus:border-blue-600 focus:ring-4 focus:ring-blue-100 outline-none transition text-sm text-slate-800"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-slate-900 hover:bg-blue-600 text-white font-semibold text-sm transition-all shadow-md hover:shadow-lg disabled:opacity-60 cursor-pointer"
            >
              <span>{loading ? "Authenticating..." : "Sign In to NestHub"}</span>
              <ArrowRight size={16} />
            </button>
          </form>

          {needsVerification && (
            <div className="mt-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs">
              <p className="font-semibold mb-1">Account not verified yet?</p>
              <button
                type="button"
                onClick={handleResend}
                className="text-blue-600 font-bold hover:underline"
              >
                Click here to resend verification email
              </button>
            </div>
          )}

          <div className="mt-8 text-center text-sm text-slate-500">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-bold text-blue-600 hover:text-blue-700 hover:underline"
            >
              Create Account
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default Login;
