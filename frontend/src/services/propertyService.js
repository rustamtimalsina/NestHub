import api from "./api";

export const getProperties = async ({
  page = 1,
  limit = 9,
  sort = "newest",
  city = "",
  propertyType = "",
  minPrice = "",
  maxPrice = "",
} = {}) => {
  const params = new URLSearchParams();
  if (page) params.append("page", page);
  if (limit) params.append("limit", limit);
  if (sort) params.append("sort", sort);
  if (city) params.append("city", city);
  if (propertyType) params.append("property_type", propertyType);
  if (minPrice) params.append("min_price", minPrice);
  if (maxPrice) params.append("max_price", maxPrice);

  const response = await api.get(`/properties/?${params.toString()}`);
  return response.data;
};

export const getCities = async () => {
  const response = await api.get("/properties/cities");
  return response.data;
};

export const getPropertyTypes = async () => {
  const response = await api.get("/properties/types");
  return response.data;
};

export const searchProperties = async (keyword) => {
  const response = await api.get(
    `/properties/search?keyword=${encodeURIComponent(keyword)}`
  );
  return response.data;
};

export const getPropertyById = async (id) => {
  const response = await api.get(`/properties/public/${id}`);
  return response.data;
};

export const addFavorite = async (propertyId) => {
  const response = await api.post(`/favorites/${propertyId}`);
  return response.data;
};

export const getFavorites = async () => {
  const response = await api.get("/favorites");
  return response.data.favorites;
};

export const removeFavorite = async (propertyId) => {
  const response = await api.delete(`/favorites/${propertyId}`);
  return response.data;
};

export const checkFavorite = async (propertyId) => {
  const response = await api.get(`/favorites/check/${propertyId}`);
  return response.data.is_favorite;
};

export const getMyProperties = async () => {
  const response = await api.get("/properties/me");
  return response.data;
};

export const deleteProperty = async (propertyId) => {
  const response = await api.delete(`/properties/${propertyId}`);
  return response.data;
};

export const updateProperty = async (propertyId, property) => {
  const response = await api.put(`/properties/${propertyId}`, property);
  return response.data;
};

export const uploadImage = async (image) => {
  const formData = new FormData();
  formData.append("file", image);

  const response = await api.post("/properties/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data.filename;
};

export const createProperty = async (property) => {
  const response = await api.post("/properties", property);
  return response.data;
};

export const getRecentProperties = async () => {
  const response = await api.get("/properties/recent");
  return response.data;
};

export const getSimilarProperties = async (propertyId) => {
  const response = await api.get(`/properties/${propertyId}/similar`);
  return response.data;
};

export const getPropertyImages = async (propertyId) => {
  const response = await api.get(`/properties/${propertyId}/images`);
  return response.data;
};

export const deletePropertyImage = async (imageId) => {
  const response = await api.delete(`/properties/images/${imageId}`);
  return response.data;
};

export const setCoverImage = async (imageId) => {
  const response = await api.put(`/properties/images/${imageId}/cover`);
  return response.data;
};

export const uploadPropertyImages = async (propertyId, files) => {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append("files", file);
  });

  const response = await api.post(
    `/properties/${propertyId}/images`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};

export const sendInquiry = async (propertyId, message) => {
  const response = await api.post(`/properties/${propertyId}/inquiry`, {
    message,
  });
  return response.data;
};

export const bookAppointment = async (propertyId, data) => {
  const response = await api.post(`/properties/${propertyId}/appointment`, data);
  return response.data;
};

export const getOwnerContact = async (propertyId) => {
  const response = await api.get(`/properties/${propertyId}/contact`);
  return response.data;
};

export const getPropertyReviews = async (propertyId) => {
  const response = await api.get(`/properties/${propertyId}/reviews`);
  return response.data;
};

export const addPropertyReview = async (propertyId, data) => {
  const response = await api.post(`/properties/${propertyId}/reviews`, data);
  return response.data;
};

export const subscribePriceAlert = async (data) => {
  const response = await api.post("/properties/alerts/subscribe", data);
  return response.data;
};
