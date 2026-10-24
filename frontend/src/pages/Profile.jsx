import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { CircleUserRound, Shield, Mail, Phone, User, Save } from "lucide-react";
import { getMe, updateProfile } from "../services/userService";
import { useAuth } from "../context/AuthContext";

function Profile() {
  const { updateUser: syncAuthUser } = useAuth();
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      try {
        const data = await getMe();
        setUser(data);
        setName(data.name || "");
        setPhone(data.phone || "");
      } catch (error) {
        console.error(error);
        toast.error("Could not load your profile.");
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  async function handleSave(e) {
    e.preventDefault();

    if (name.trim().length < 3) {
      toast.error("Name must be at least 3 characters.");
      return;
    }

    if (!/^\d{10}$/.test(phone)) {
      toast.error("Phone number must be exactly 10 digits.");
      return;
    }

    setSaving(true);

    try {
      const data = await updateProfile(name.trim(), phone);
      toast.success(data.message || "Profile updated!");
      setUser({ ...user, name: name.trim(), phone });
      syncAuthUser({ name: name.trim(), phone });
    } catch (error) {
      if (error.response?.status === 429) {
        toast.error("Too many attempts. Please wait and try again.");
      } else {
        toast.error(error.response?.data?.detail || "Could not update profile.");
      }
    } finally {
      setSaving(false);
    }
  }

  if (loading || !user) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-[85vh] bg-slate-50/60 flex items-center justify-center px-4 py-16">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-sm border border-slate-100 p-8 sm:p-10">
        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center text-2xl font-black shadow-md shadow-blue-500/20">
            {user.name ? user.name.slice(0, 2).toUpperCase() : "U"}
          </div>
          <h1 className="text-2xl font-black text-slate-900 mt-4">{user.name}</h1>
          <span
            className={`mt-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
              user.role === "admin"
                ? "bg-purple-100 text-purple-700"
                : "bg-blue-50 text-blue-700"
            }`}
          >
            {user.role === "admin" ? "Platform Administrator" : "Verified Member"}
          </span>
        </div>

        <form onSubmit={handleSave} className="space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                value={user.email}
                disabled
                className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 text-slate-400 text-sm cursor-not-allowed"
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Your registered email cannot be changed.
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
              Full Name
            </label>
            <div className="relative">
              <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 text-sm outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition text-slate-800"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
              Phone Number (10 Digits)
            </label>
            <div className="relative">
              <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="tel"
                required
                maxLength="10"
                placeholder="98XXXXXXXX"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 text-sm outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition text-slate-800"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all disabled:opacity-60 cursor-pointer pt-3 mt-6"
          >
            <Save size={16} />
            <span>{saving ? "Saving Changes..." : "Update Profile"}</span>
          </button>
        </form>
      </div>
    </div>
  );
}

export default Profile;
