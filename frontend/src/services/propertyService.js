import api from "./api";

export const getProperties = async (
  page = 1,
  sort = "newest",
  city = "",
  propertyType = ""
) => {

  const response = await api.get(
    `/properties/?page=${page}&limit=5&sort=${sort}&city=${city}&property_type=${propertyType}`
  );

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
  const token = localStorage.getItem("token");

  const response = await api.post(
    "/properties/upload",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
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
