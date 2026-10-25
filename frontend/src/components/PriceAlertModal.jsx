import { useState } from "react";
import { subscribePriceAlert } from "../services/propertyService";
import { toast } from "react-toastify";
import { Bell, CheckCircle2, X } from "lucide-react";

export default function PriceAlertModal({ isOpen, onClose, defaultCity = "", defaultType = "" }) {
  const [email, setEmail] = useState("");
  const [city, setCity] = useState(defaultCity || "");
  const [propertyType, setPropertyType] = useState(defaultType || "");
  const [maxPrice, setMaxPrice] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  if (!isOpen) return null;

  async function handleSubscribe(e) {
    e.preventDefault();
    if (!email.includes("@")) {
      toast.error("Please provide a valid email address.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await subscribePriceAlert({
        email: email.trim(),
        city: city || undefined,
        property_type: propertyType || undefined,
        max_price: maxPrice ? Number(maxPrice) : undefined,
      });
      setSubscribed(true);
      toast.success(res?.message || "Subscribed to property alerts!");
    } catch (err) {
      const msg = err.response?.data?.detail || "Could not save alert preference.";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 border border-slate-100 dark:border-slate-800 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-xl"
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center">
            <Bell size={20} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Instant Property Alerts
            </h3>
            <p className="text-xs text-slate-400">
              Get notified when new listings or price drops match your criteria.
            </p>
          </div>
        </div>

        {subscribed ? (
          <div className="py-6 text-center">
            <CheckCircle2 size={44} className="text-emerald-500 mx-auto mb-3" />
            <h4 className="text-base font-bold text-slate-900 dark:text-white">
              Alerts Activated!
            </h4>
            <p className="text-xs text-slate-500 mt-1">
              We will email you at <strong>{email}</strong> the moment matching luxury properties or price reductions drop.
            </p>
            <button
              onClick={onClose}
              className="mt-6 px-6 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubscribe} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
                Your Email Address *
              </label>
              <input
                type="email"
                required
                placeholder="name@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
                  Preferred City
                </label>
                <input
                  type="text"
                  placeholder="e.g. Lalitpur, Pokhara"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
                  Max Budget (NPR)
                </label>
                <input
                  type="number"
                  placeholder="e.g. 25000000"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-xs cursor-pointer disabled:opacity-50"
              >
                {submitting ? "Subscribing..." : "Activate Alerts"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
