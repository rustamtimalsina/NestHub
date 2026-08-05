import api from "./api";

export const loginUser = async (email, password) => {
  const formData = new URLSearchParams();

  formData.append("username", email);
  formData.append("password", password);

  const response = await api.post(
    "/users/login",
    formData,
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  return response.data;
};

export const registerUser = async (user) => {
  const response = await api.post("/users", user);
  return response.data;
};
export const forgotPassword = async (email) => {
  const response = await api.post(
    `/users/forgot-password?email=${encodeURIComponent(email)}`
  );

  return response.data;
};
export const resetPassword = async (token, password) => {
  const response = await api.post("/users/reset-password", {
    token,
    password,
  });

  return response.data;
};