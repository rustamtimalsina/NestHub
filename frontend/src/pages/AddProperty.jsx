import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { uploadImage, createProperty } from "../services/propertyService";
import { ArrowLeft, Upload, Building, Plus, Sparkles } from "lucide-react";

function AddProperty() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [city, setCity] = useState("");
  const [price, setPrice] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [bathrooms, setBathrooms] = useState("");
  const [area, setArea] = useState("");
  const [propertyType, setPropertyType] = useState("Apartment");
  const [status, setStatus] = useState("Available");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  function chooseFile(file) {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please choose a valid image file (JPEG, PNG, WebP).");
      return;
    }

    setImage(file);
    setPreview(URL.createObjectURL(file));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!image) {
      toast.error("Please upload a cover photo for your listing.");
      return;
    }

    setLoading(true);

    try {
      const filename = await uploadImage(image);

      await createProperty({
        title: title.trim(),
        description: description.trim(),
        city: city.trim(),
        price: Number(price),
        bedrooms: Number(bedrooms),
        bathrooms: Number(bathrooms),
        area: Number(area),
        property_type: propertyType,
        status: status,
        image: filename,
      });

      toast.success("Listing published successfully!");
      navigate("/my-properties");
    } catch (error) {
      setLoading(false);
      console.error(error);
      toast.error(error.response?.data?.detail || "Failed to publish property.");
    }
  }

  return (
    <div className="min-h-screen bg-slate-50/60 py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <Link
          to="/my-properties"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 mb-6 transition"
        >
          <ArrowLeft size={16} />
          Back to Listings
        </Link>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 sm:p-12">
          <div className="mb-8 pb-6 border-b border-slate-100">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-50 text-blue-600">
              New Listing
            </span>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight mt-2">
              List Your Property
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Reach verified buyers and tenants across Nepal. Fill in the listing details below.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                Property Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Modern 3BHK Apartment in Jhamsikhel"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-sm outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                Full Description *
              </label>
              <textarea
                rows="5"
                required
                placeholder="Highlight neighborhood perks, floor level, parking, water facility, sun-facing orientation, etc..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-sm outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition resize-none"
              />
            </div>

            {/* Location & Price */}
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                  City / Location *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Lalitpur, Kathmandu, Pokhara"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-sm outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                  Price (NPR) *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  placeholder="e.g. 25000000"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-sm outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition"
                />
              </div>
            </div>

            {/* Bedrooms, Bathrooms, Area */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                  Bedrooms
                </label>
                <input
                  type="number"
                  min="0"
                  required
                  placeholder="3"
                  value={bedrooms}
                  onChange={(e) => setBedrooms(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-sm outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                  Bathrooms
                </label>
                <input
                  type="number"
                  min="0"
                  required
                  placeholder="2"
                  value={bathrooms}
                  onChange={(e) => setBathrooms(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-sm outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                  Area (sq.ft) *
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  placeholder="1450"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-sm outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition"
                />
              </div>
            </div>

            {/* Type & Status */}
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                  Category
                </label>
                <select
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-sm outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition bg-white cursor-pointer"
                >
                  <option value="Apartment">Apartment</option>
                  <option value="House">House</option>
                  <option value="Villa">Villa</option>
                  <option value="Land">Land</option>
                  <option value="Office">Office</option>
                  <option value="Commercial">Commercial</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                  Initial Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-sm outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition bg-white cursor-pointer"
                >
                  <option value="Available">Available</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>
            </div>

            {/* Cover Image Upload Drag & Drop Zone */}
            <div className="pt-4 border-t border-slate-100">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                Primary Cover Photo *
              </label>

              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                  chooseFile(e.dataTransfer.files[0]);
                }}
                className={`relative border-2 border-dashed rounded-3xl p-8 text-center transition cursor-pointer ${
                  isDragging
                    ? "border-blue-600 bg-blue-50/50"
                    : preview
                    ? "border-emerald-300 bg-emerald-50/20"
                    : "border-slate-200 hover:border-slate-300 bg-slate-50/50"
                }`}
              >
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => chooseFile(e.target.files[0])}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />

                {preview ? (
                  <div className="flex flex-col items-center">
                    <img
                      src={preview}
                      alt="Cover Preview"
                      className="w-64 h-40 object-cover rounded-2xl shadow-sm mb-3"
                    />
                    <p className="text-xs font-semibold text-emerald-600">
                      Photo selected. Click or drag to replace.
                    </p>
                  </div>
                ) : (
                  <div>
                    <Upload size={32} className="mx-auto text-slate-400 mb-3" />
                    <p className="text-sm font-bold text-slate-700">
                      Drop cover photo here, or browse files
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      JPEG, PNG, or WebP up to 5 MB
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Submit */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition shadow-md hover:shadow-lg disabled:opacity-60 cursor-pointer"
              >
                <Plus size={18} />
                <span>{loading ? "Uploading & Publishing..." : "Publish Listing"}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddProperty;
