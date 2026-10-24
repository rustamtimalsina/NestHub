export function getImageUrl(apiUrl, image) {
  if (!image) return "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80";

  // Cloudinary photos or external URLs are already full web addresses
  if (image.startsWith("http://") || image.startsWith("https://")) {
    return image;
  }

  // Older or locally uploaded photos
  const rawUrl = apiUrl || import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";
  const baseUrl = rawUrl.replace(/\/+$/, "");
  return `${baseUrl}/uploads/${image.replace(/^\/+/, "")}`;
}
