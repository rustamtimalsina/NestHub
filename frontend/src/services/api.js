import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url || "";
    const hadToken = !!localStorage.getItem("token");

    // Wrong password at login must not trigger a redirect
    const isLogin = url.includes("/users/login");

    if (status === 401 && hadToken && !isLogin) {
      // The saved login expired: clear it and ask the user to log in again
      localStorage.removeItem("token");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;