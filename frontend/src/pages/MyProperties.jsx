import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getMyProperties,
  deleteProperty,
  uploadPropertyImages,
  getPropertyImages,
  deletePropertyImage,
  setCoverImage,
} from "../services/propertyService";
import PropertyCard from "../components/PropertyCard";
import Swal from "sweetalert2";

const API_URL = import.meta.env.VITE_API_URL;

function MyProperties() {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
const [selectedProperty, setSelectedProperty] = useState(null);
const [selectedFiles, setSelectedFiles] = useState([]);
const [galleryImages, setGalleryImages] = useState([]);

  useEffect(() => {
    let active = true;

    async function loadMyProperties() {
      try {
        const data = await getMyProperties();
        if (active) setProperties(data);
      } catch (error) {
        console.error(error);
      }
    }

    loadMyProperties();
    return () => {
      active = false;
    };
  }, []);

 async function handleDelete(propertyId) {
  const result = await Swal.fire({
    title: "Delete Property?",
    text: "You won't be able to recover this property!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#dc2626",
    cancelButtonColor: "#2563eb",
    confirmButtonText: "Yes, delete it!",
    cancelButtonText: "Cancel",
  });

  if (!result.isConfirmed) return;

  try {
    const data = await deleteProperty(propertyId);

    await Swal.fire({
      icon: "success",
      title: "Deleted!",
      text: data.message,
      confirmButtonColor: "#2563eb",
    });

    const refreshedProperties = await getMyProperties();
    setProperties(refreshedProperties);
  } catch (error) {
    console.error(error);

    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Failed to delete property.",
      confirmButtonColor: "#2563eb",
    });
  }
}
async function openUploadModal(propertyId) {
  setSelectedProperty(propertyId);
  setSelectedFiles([]);

  try {
    const images = await getPropertyImages(propertyId);
    console.log("Images:", images);
    setGalleryImages(images);
  } catch (error) {
    console.error(error);
  }

  setShowUploadModal(true);
}

function closeUploadModal() {
  setShowUploadModal(false);
  setSelectedProperty(null);
  setSelectedFiles([]);
}

async function uploadImages() {
  if (selectedFiles.length === 0) {
    Swal.fire({
      icon: "warning",
      title: "No Images Selected",
      text: "Please choose at least one image.",
    });
    return;
  }

  try {
    // Upload images
    await uploadPropertyImages(selectedProperty, selectedFiles);

    // Reload the gallery
    const images = await getPropertyImages(selectedProperty);
    setGalleryImages(images);

    // Clear selected files
    setSelectedFiles([]);

    Swal.fire({
      icon: "success",
      title: "Success!",
      text: "Images uploaded successfully.",
    });

  } catch (error) {
    console.error(error);

    Swal.fire({
      icon: "error",
      title: "Upload Failed",
      text: "Could not upload images.",
    });
  }
}

async function makeCover(imageId) {
  try {
    const data = await setCoverImage(imageId);

    Swal.fire({
      icon: "success",
      title: "Success",
      text: data.message,
    });

    // Refresh gallery
    const images = await getPropertyImages(selectedProperty);
    setGalleryImages(images);

    // Refresh property cards
    const refreshed = await getMyProperties();
    setProperties(refreshed);

  } catch (error) {
    console.error(error);

    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Could not update cover image.",
    });
  }
}
async function removeImage(imageId) {
  const result = await Swal.fire({
    title: "Delete Image?",
    text: "This image will be permanently deleted.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#dc2626",
    confirmButtonText: "Delete",
    cancelButtonText: "Cancel",
  });

  if (!result.isConfirmed) return;

  try {
    await deletePropertyImage(imageId);

    const images = await getPropertyImages(selectedProperty);
    setGalleryImages(images);

    Swal.fire({
      icon: "success",
      title: "Deleted!",
      text: "Image deleted successfully.",
    });

  } catch (error) {
    console.error(error);

    Swal.fire({
      icon: "error",
      title: "Delete Failed",
      text: "Could not delete image.",
    });
  }
}

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">

     <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-6 mb-10">

  <div>

    <h1 className="text-4xl font-bold">
      My Properties
    </h1>

    <p className="text-gray-500 mt-2">
  You have <span className="font-bold text-blue-600">{properties.length}</span> listed {properties.length === 1 ? "property" : "properties"}.
</p>

  </div>

  <button
    onClick={() => navigate("/add-property")}
   className="bg-blue-600 hover:bg-blue-700 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-white px-6 py-3 rounded-xl font-semibold"
  >
    + Add Property
  </button>

</div>

      {properties.length === 0 ? (
        <div className="text-center py-24">

  <h2 className="text-3xl font-bold mb-4">
    No Properties Yet
  </h2>

  <p className="text-gray-500 mb-8">
    Start by listing your first property.
  </p>

  <button
    onClick={() => navigate("/add-property")}
    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold transition"
  >
    Add Your First Property
  </button>

</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">

       {properties.map((property) => (
  <div key={property.id}>

    <PropertyCard property={property} />

    <div className="flex gap-3 mt-3">

      <button
  onClick={() => navigate(`/edit-property/${property.id}`)}
 className="flex-1 bg-amber-500 hover:bg-amber-600 hover:shadow-lg transition-all duration-300 text-white py-3 rounded-xl font-semibold"
>
  ✏️ Edit
      </button>
      <button
  onClick={() => openUploadModal(property.id)}
  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
>
  Upload Images
</button>

      <button
        onClick={() => handleDelete(property.id)}
       className="flex-1 bg-red-600 hover:bg-red-700 hover:shadow-lg transition-all duration-300 text-white py-3 rounded-xl font-semibold"
      >
        🗑 Delete
      </button>

    </div>

  </div>
))}

        </div>
      )}
       {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 w-full max-w-lg shadow-2xl">

            <h2 className="text-2xl font-bold mb-6">
              Upload Property Images
            </h2>

            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => setSelectedFiles(Array.from(e.target.files))}
              className="mb-6 w-full"
            />

            {selectedFiles.length > 0 && (
              <div className="mb-6">
                <p className="font-semibold mb-2">
                  Selected Files:
                </p>

                {selectedFiles.map((file, index) => (
                  <p key={index} className="text-gray-600">
                    {file.name}
                  </p>
                ))}
              </div>
            )}
            {galleryImages.length > 0 && (
              <>
                <h3 className="font-semibold mb-3">Uploaded Images</h3>

                <div className="grid grid-cols-3 gap-3">
                  {galleryImages.map((image) => (
                    <div
                      key={image.id}
                      className="relative border rounded-lg overflow-hidden"
                    >
                      <img
                        src={`${API_URL}/uploads/${image.image}`}
                        alt=""
                        className="w-full h-24 object-cover"
                      />

                      <div className="absolute top-1 right-1 flex gap-1">
                        <button
                          onClick={() => makeCover(image.id)}
                          className="bg-yellow-500 hover:bg-yellow-600 text-white rounded-full px-2 py-1 text-xs"
                          title="Set as Cover"
                        >
                          ⭐
                        </button>

                        <button
                          onClick={() => removeImage(image.id)}
                          className="bg-red-600 hover:bg-red-700 text-white rounded-full px-2 py-1 text-xs"
                          title="Delete Image"
                        >
                          🗑
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            <div className="flex gap-3">
              <button
                onClick={uploadImages}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg"
              >
                Upload
              </button>

              <button
                onClick={closeUploadModal}
                className="flex-1 bg-gray-300 hover:bg-gray-400 py-3 rounded-lg"
              >
                Cancel
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

export default MyProperties;
