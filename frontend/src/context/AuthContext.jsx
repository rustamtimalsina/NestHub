import { createContext, useContext, useState, useEffect, useCallback } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async (jwtToken) => {
    if (!jwtToken) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const response = await api.get("/users/me");
      setUser(response.data);
    } catch (error) {
      console.error("Failed to load user session:", error);
      localStorage.removeItem("token");
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (token) {
      fetchUser(token);
    } else {
      setLoading(false);
    }

    const handleSessionLogout = () => {
      setToken(null);
      setUser(null);
    };

    window.addEventListener("auth-logout", handleSessionLogout);
    return () => window.removeEventListener("auth-logout", handleSessionLogout);
  }, [token, fetchUser]);

  const login = async (newToken) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
    setLoading(true);
    await fetchUser(newToken);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  const updateUser = (updatedFields) => {
    setUser((prev) => (prev ? { ...prev, ...updatedFields } : prev));
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        loading,
        isAuthenticated: !!token && !!user,
        isAdmin: user?.role === "admin",
        login,
        logout,
        updateUser,
        refreshUser: () => fetchUser(token),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
