import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import instance from "../services/axiosConfig";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authTokens, setAuthTokens] = useState(() =>
    localStorage.getItem("authTokens")
      ? JSON.parse(localStorage.getItem("authTokens"))
      : null
  );
  const [user, setUser] = useState(() =>
    localStorage.getItem("authTokens")
      ? jwtDecode(localStorage.getItem("authTokens"))
      : null
  );
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const response = await instance.post(
        "/auth/login",
        { email, password },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const { accessToken, refreshToken, ...data } = response.data;
      setUser(jwtDecode(accessToken));
      localStorage.setItem(
        "authTokens",
        JSON.stringify({ accessToken, refreshToken })
      );
      localStorage.setItem("user", JSON.stringify(jwtDecode(accessToken)));

      setIsAuthenticated(true);
      navigate("/");
      return response.data;
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  };

  const signup = async (email, full_name, password) => {
    setIsLoading(true);
    try {
      const response = await instance.post(
        "/auth/signup",
        { email, full_name, password },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response);
      navigate("/login");
    } catch (error) {
      setIsLoading(false);
      console.log(error.message);
      throw error;
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setAuthTokens(null);
    setUser(null);
    localStorage.clear();
    navigate("/login");
  };

  const contextData = {
    user: user,
    authTokens: authTokens,
    setAuthTokens: setAuthTokens,
    isAuthenticated: isAuthenticated,
    setUser: setUser,
    login: login,
    signup: signup,
    logout: logout,
  };

  useEffect(() => {
    if (authTokens) {
      setUser(jwtDecode(authTokens?.accessToken));
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, [authTokens, isLoading]);

  return (
    <AuthContext.Provider value={contextData}>
      {isLoading ? null : children}
    </AuthContext.Provider>
  );
};
