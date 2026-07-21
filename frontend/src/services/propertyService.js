import api from "./api";

export const getProperties = async () => {
  const response = await api.get("/properties");
  return response.data;
};

export const searchProperties = async (keyword) => {
  const response = await api.get(
    `/properties/search?keyword=${keyword}`
  );

  return response.data;
};

export const getPropertyById = async (id) => {
  const response = await api.get(
    `/properties/public/${id}`
  );

  return response.data;
};

export const addFavorite = async (propertyId) => {
  const token = localStorage.getItem("token");

  const response = await api.post(
    `/favorites/${propertyId}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const getFavorites = async () => {
  const token = localStorage.getItem("token");

  const response = await api.get(
    "/favorites",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data.favorites;
};

export const removeFavorite = async (propertyId) => {
  const token = localStorage.getItem("token");

  const response = await api.delete(
    `/favorites/${propertyId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const checkFavorite = async (propertyId) => {
  const token = localStorage.getItem("token");

  const response = await api.get(
    `/favorites/check/${propertyId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data.is_favorite;
};

export const getMyProperties = async () => {
  const token = localStorage.getItem("token");

  const response = await api.get(
    "/properties/me",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const deleteProperty = async (propertyId) => {
  const token = localStorage.getItem("token");

  const response = await api.delete(
    `/properties/${propertyId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const updateProperty = async (propertyId, property) => {
  const token = localStorage.getItem("token");

  const response = await api.put(
    `/properties/${propertyId}`,
    property,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};
export const uploadImage = async (image) => {
  const formData = new FormData();

  formData.append("file", image);

  const response = await api.post(
    "/properties/upload",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data.filename;
};
export const createProperty = async (property) => {
  const token = localStorage.getItem("token");

  const response = await api.post(
    "/properties",
    property,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};