export function getImageUrl(apiUrl, image) {
  if (!image) return "";

  // Cloudinary photos are already full web addresses
  if (image.startsWith("http")) return image;

  // Older photos are only file names on the backend
  return `${apiUrl}/uploads/${image}`;
}