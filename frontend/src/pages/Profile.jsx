import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { CircleUserRound } from "lucide-react";
import { getMe, updateProfile } from "../services/userService";

function Profile() {
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [saving, setSaving] = useState(false);

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
      toast.success(data.message);
      setUser({ ...user, name: name.trim(), phone });
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

  if (!user) {
    return <p className="text-center text-xl mt-20">Loading...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-12">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-xl p-8">

        <div className="flex flex-col items-center mb-8">
          <CircleUserRound size={64} className="text-blue-600" />
          <h1 className="text-3xl font-bold mt-3">My Profile</h1>
          <span
            className={`mt-2 px-3 py-1 rounded-full text-sm font-semibold ${
              user.role === "admin"
                ? "bg-purple-100 text-purple-700"
                : "bg-blue-100 text-blue-700"
            }`}
          >
            {user.role === "admin" ? "Admin" : "User"}
          </span>
        </div>

        <form onSubmit={handleSave} className="space-y-5">

          <div>
            <label className="block mb-2 font-medium">Email</label>
            <input
              type="email"
              value={user.email}
              disabled
              className="w-full border border-gray-200 bg-gray-100 text-gray-500 rounded-lg p-3"
            />
            <p className="text-xs text-gray-400 mt-1">
              Your email is your login and cannot be changed.
            </p>
          </div>

          <div>
            <label className="block mb-2 font-medium">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">Phone Number</label>
            <input
              type="text"
              maxLength={10}
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className={`w-full py-3 rounded-lg font-semibold text-white transition ${
              saving
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>

        </form>
      </div>
    </div>
  );
}

export default Profile;