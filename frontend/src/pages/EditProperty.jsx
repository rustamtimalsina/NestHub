import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  getPropertyById,
  updateProperty,
  uploadImage,
} from "../services/propertyService";
import { toast } from "react-toastify";
import { getImageUrl } from "../utils/imageUrl";
import { ArrowLeft, Upload, Check, Home, Save } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;

function EditProperty() {
  const { id } = useParams();
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
  const [currentImage, setCurrentImage] = useState("");
  const [newImageFile, setNewImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadData() {
      try {
        const prop = await getPropertyById(id);
        if (active) {
          setTitle(prop.title || "");
          setDescription(prop.description || "");
          setCity(prop.city || "");
          setPrice(prop.price || "");
          setBedrooms(prop.bedrooms || 0);
          setBathrooms(prop.bathrooms || 0);
          setArea(prop.area || 0);
          setPropertyType(prop.property_type || "Apartment");
          setStatus(prop.status || "Available");
          setCurrentImage(prop.image || "");
        }
      } catch (err) {
        console.error(err);
        toast.error("Could not load property details.");
      } finally {
        if (active) setLoading(false);
      }
    }

    loadData();
    return () => {
      active = false;
    };
  }, [id]);

  function handleFileChange(e) {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file (JPEG, PNG, WebP).");
      return;
    }

    setNewImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);

    try {
      let finalImageUrl = currentImage;

      // If user selected a new cover image, upload it first
      if (newImageFile) {
        finalImageUrl = await uploadImage(newImageFile);
      }

      await updateProperty(id, {
        title: title.trim(),
        description: description.trim(),
        city: city.trim(),
        price: Number(price),
        bedrooms: Number(bedrooms),
        bathrooms: Number(bathrooms),
        area: Number(area),
        property_type: propertyType,
        status: status,
        image: finalImageUrl,
      });

      toast.success("Listing updated successfully!");
      navigate("/my-properties");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.detail || "Failed to update property.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/60 py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <Link
          to="/my-properties"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 mb-6 transition"
        >
          <ArrowLeft size={16} />
          Back to My Listings
        </Link>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 sm:p-12">
          <div className="mb-8 pb-6 border-b border-slate-100">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-50 text-blue-600">
              Listing Editor
            </span>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight mt-2">
              Edit Property Listing
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Update pricing, status, specs, or images for listing #{id}.
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
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-sm outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                Description *
              </label>
              <textarea
                rows="5"
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-sm outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition resize-none"
              />
            </div>

            {/* City & Price */}
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                  City / Location *
                </label>
                <input
                  type="text"
                  required
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
                  Property Category
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
                  Listing Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-sm outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition bg-white cursor-pointer"
                >
                  <option value="Available">Available</option>
                  <option value="Sold">Sold</option>
                  <option value="Rented">Rented</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>
            </div>

            {/* Image Preview & Replacement */}
            <div className="pt-4 border-t border-slate-100">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-3">
                Cover Photo
              </label>

              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="w-48 h-32 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 flex-shrink-0">
                  <img
                    src={previewUrl || getImageUrl(API_URL, currentImage)}
                    alt="Cover preview"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="space-y-2">
                  <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer transition">
                    <Upload size={15} />
                    <span>Change Cover Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                  <p className="text-xs text-slate-400">
                    Supports JPEG, PNG, or WebP up to 5 MB.
                  </p>
                </div>
              </div>
            </div>

            {/* Submit */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={saving}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition shadow-md hover:shadow-lg disabled:opacity-60 cursor-pointer"
              >
                <Save size={17} />
                <span>{saving ? "Saving Changes..." : "Save Listing Changes"}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditProperty;
