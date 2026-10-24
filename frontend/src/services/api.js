import axios from "axios";

const rawUrl = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";
const baseURL = rawUrl.replace(/\/+$/, "");

const api = axios.create({
  baseURL,
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
      localStorage.removeItem("token");
      // Notify auth context via storage event or dispatch custom event
      window.dispatchEvent(new Event("auth-logout"));
    }

    return Promise.reject(error);
  }
);

export default api;
