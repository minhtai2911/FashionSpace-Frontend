import { createContext, useState, useEffect } from "react";
import axios from "../services/axiosConfig";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const checkAuth = async () => {
    const accessToken = localStorage.getItem("token");
    const refreshToken = localStorage.getItem("refreshToken");

    if (!accessToken && !refreshToken) {
      setIsAuthenticated(false);
      setUser(null);
      return;
    }

    try {
      if (accessToken) {
        const decodedToken = jwtDecode(accessToken);
        const currentTime = Date.now() / 1000;

        if (decodedToken.exp > currentTime) {
          setIsAuthenticated(true);
          setUser(decodedToken);
          return;
        }
      }

      if (refreshToken) {
        const newAccessToken = await refreshAccessToken();
        if (newAccessToken) {
          const decodedToken = jwtDecode(newAccessToken);
          setIsAuthenticated(true);
          setUser(decodedToken);
          return;
        }
      }

      setIsAuthenticated(false);
      setUser(null);
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
    } catch (error) {
      console.error("Auth check failed:", error);
      setIsAuthenticated(false);
      setUser(null);
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const refreshAccessToken = async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) {
        return null;
      }

      const response = await axios.post(
        "http://localhost:8000/api/v1/auth/refreshToken",
        { refreshToken }
      );
      const newAccessToken = response.data.accessToken;
      localStorage.setItem("token", newAccessToken);
      return newAccessToken;
    } catch (error) {
      console.error("Token refresh failed:", error);
      return null;
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await axios.post("http://localhost:8000/api/v1/auth/logout");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsAuthenticated(false);
      setUser(null);
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      setIsLoading(false);
      navigate("/");
    }
  };

  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/auth/login",
        {
          email,
          password,
        }
      );
      const { accessToken, refreshToken, ...data } = response.data;
      localStorage.setItem("token", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      setIsAuthenticated(true);
      setUser(data);
      setIsLoading(false);
      navigate("/");
      return data;
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        user,
        setUser,
        logout,
        login,
        isLoading,
        setIsLoading,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
