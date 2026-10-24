import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  getMyProperties,
  deleteProperty,
  uploadPropertyImages,
  getPropertyImages,
  deletePropertyImage,
  setCoverImage,
} from "../services/propertyService";
import PropertyCard from "../components/PropertyCard";
import { toast } from "react-toastify";
import { getImageUrl } from "../utils/imageUrl";
import {
  Plus,
  Edit,
  Trash2,
  Images,
  X,
  Star,
  Upload,
  Building,
} from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;

function MyProperties() {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  // Gallery Modal
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedPropertyId, setSelectedPropertyId] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [galleryImages, setGalleryImages] = useState([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadListings() {
      try {
        setLoading(true);
        const data = await getMyProperties();
        if (active) setProperties(data || []);
      } catch (error) {
        console.error(error);
        toast.error("Could not load your properties.");
      } finally {
        if (active) setLoading(false);
      }
    }

    loadListings();
    return () => {
      active = false;
    };
  }, []);

  async function handleDelete(propertyId) {
    if (!window.confirm("Are you sure you want to delete this property? This cannot be undone.")) {
      return;
    }

    try {
      await deleteProperty(propertyId);
      setProperties((current) => current.filter((p) => p.id !== propertyId));
      toast.success("Listing deleted successfully.");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete property.");
    }
  }

  async function openUploadModal(propertyId) {
    setSelectedPropertyId(propertyId);
    setSelectedFiles([]);

    try {
      const images = await getPropertyImages(propertyId);
      setGalleryImages(images || []);
    } catch (error) {
      console.error(error);
    }

    setShowUploadModal(true);
  }

  function closeUploadModal() {
    setShowUploadModal(false);
    setSelectedPropertyId(null);
    setSelectedFiles([]);
  }

  async function uploadImages() {
    if (selectedFiles.length === 0) {
      toast.warn("Please choose at least one image file.");
      return;
    }

    setUploading(true);
    try {
      await uploadPropertyImages(selectedPropertyId, selectedFiles);
      const images = await getPropertyImages(selectedPropertyId);
      setGalleryImages(images || []);
      setSelectedFiles([]);
      toast.success("Images uploaded to gallery!");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.detail || "Could not upload images.");
    } finally {
      setUploading(false);
    }
  }

  async function handleMakeCover(imageId) {
    try {
      await setCoverImage(imageId);
      toast.success("Cover image updated!");
      // Refresh properties list
      const refreshed = await getMyProperties();
      setProperties(refreshed || []);
      // Refresh gallery
      const images = await getPropertyImages(selectedPropertyId);
      setGalleryImages(images || []);
    } catch (error) {
      console.error(error);
      toast.error("Could not set cover image.");
    }
  }

  async function handleRemoveImage(imageId) {
    if (!window.confirm("Delete this photo from the gallery?")) {
      return;
    }

    try {
      await deletePropertyImage(imageId);
      setGalleryImages((current) => current.filter((img) => img.id !== imageId));
      toast.success("Photo removed.");
    } catch (error) {
      console.error(error);
      toast.error("Could not delete image.");
    }
  }

  return (
    <div className="min-h-screen bg-slate-50/60 py-10 px-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              My Property Listings
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Manage your listed properties, view status, and manage photo galleries.
            </p>
          </div>

          <Link
            to="/add-property"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all"
          >
            <Plus size={18} />
            <span>List New Property</span>
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
        ) : properties.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center max-w-lg mx-auto border border-slate-100 shadow-xs">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4">
              <Building size={28} />
            </div>
            <h2 className="text-xl font-bold text-slate-800">No Listings Yet</h2>
            <p className="text-slate-500 text-sm mt-2">
              You haven't listed any properties yet. Reach thousands of potential buyers across Nepal.
            </p>
            <Link
              to="/add-property"
              className="inline-flex items-center gap-2 mt-6 px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-sm transition"
            >
              <Plus size={16} />
              List Your First Property
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map((property) => (
              <div key={property.id} className="flex flex-col h-full">
                <PropertyCard property={property} />

                {/* Owner Actions Toolbar */}
                <div className="grid grid-cols-3 gap-2 mt-3 p-2 bg-white rounded-2xl border border-slate-100 shadow-xs">
                  <Link
                    to={`/edit-property/${property.id}`}
                    className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
                  >
                    <Edit size={14} />
                    Edit
                  </Link>

                  <button
                    onClick={() => openUploadModal(property.id)}
                    className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs font-bold transition"
                  >
                    <Images size={14} />
                    Gallery
                  </button>

                  <button
                    onClick={() => handleDelete(property.id)}
                    className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold transition"
                  >
                    <Trash2 size={14} />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Gallery Management Modal */}
        {showUploadModal && (
          <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-8 max-w-xl w-full shadow-2xl border border-slate-100">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <h2 className="text-xl font-bold text-slate-900">
                  Manage Photos (Listing #{selectedPropertyId})
                </h2>
                <button
                  onClick={closeUploadModal}
                  className="p-2 text-slate-400 hover:text-slate-700 rounded-xl"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Upload New Photos */}
              <div className="my-6 p-6 border-2 border-dashed border-slate-200 rounded-2xl text-center">
                <Upload size={28} className="mx-auto text-slate-400 mb-2" />
                <p className="text-xs font-bold text-slate-700">
                  Upload multiple property photos
                </p>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => setSelectedFiles(Array.from(e.target.files))}
                  className="mt-3 text-xs text-slate-500 w-full"
                />

                {selectedFiles.length > 0 && (
                  <button
                    onClick={uploadImages}
                    disabled={uploading}
                    className="mt-4 px-6 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition"
                  >
                    {uploading ? "Uploading..." : `Upload ${selectedFiles.length} Photos`}
                  </button>
                )}
              </div>

              {/* Existing Gallery Grid */}
              {galleryImages.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                    Existing Gallery Photos ({galleryImages.length})
                  </h3>
                  <div className="grid grid-cols-3 gap-3 max-h-56 overflow-y-auto p-1">
                    {galleryImages.map((img) => (
                      <div
                        key={img.id}
                        className="relative rounded-xl overflow-hidden aspect-video bg-slate-100 group border border-slate-200"
                      >
                        <img
                          src={getImageUrl(API_URL, img.image)}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleMakeCover(img.id)}
                            className="p-1.5 rounded-lg bg-amber-500 text-white hover:bg-amber-600 transition"
                            title="Make Cover Photo"
                          >
                            <Star size={14} />
                          </button>
                          <button
                            onClick={() => handleRemoveImage(img.id)}
                            className="p-1.5 rounded-lg bg-rose-600 text-white hover:bg-rose-700 transition"
                            title="Delete Image"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-6 border-t border-slate-100 mt-6 flex justify-end">
                <button
                  onClick={closeUploadModal}
                  className="px-6 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MyProperties;
