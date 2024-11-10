import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import instance from "../services/axiosConfig";
import { jwtDecode } from "jwt-decode";
import toast from "react-hot-toast";
import useAxios from "../services/useAxios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authTokens, setAuthTokens] = useState(() => {
    const tokens = localStorage.getItem("authTokens");
    return tokens ? JSON.parse(tokens) : null;
  });
  const [user, setUser] = useState(() =>
    authTokens ? jwtDecode(authTokens.accessToken) : null
  );
  const navigate = useNavigate();

  // Utility function to set auth tokens
  const setTokens = (tokens) => {
    localStorage.removeItem("authTokens");

    // Check if tokens have the correct format, if not, extract the nested values
    const formattedTokens = {
      accessToken:
        typeof tokens.accessToken === "string"
          ? tokens.accessToken
          : tokens.accessToken?.accessToken,
      refreshToken: tokens.refreshToken || tokens.accessToken?.refreshToken,
    };

    setAuthTokens(formattedTokens);
    localStorage.setItem("authTokens", JSON.stringify(formattedTokens));
  };

  const signup = async (email, fullName, phone, password) => {
    try {
      const response = await instance.post(
        "/auth/signup",
        { email, fullName, phone, password },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      toast.success("Sign up successfully", { duration: 2000 });
      const id = response.data.data._id;
      const sendMailResponse = await toast.promise(
        instance.post(
          "/auth/sendMailVerifyAccount",
          {
            email: email,
            id: id,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        ),
        {
          loading: "Sending verification email...",
          success: "Verification email sent successfully",
          error: "Failed to send verification email",
        }
      );
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "An error occurred", {
        duration: 2000,
      });
    }
  };

  const logout = async () => {
    if (!isAuthenticated) {
      return;
    }

    try {
      const accessToken = authTokens?.accessToken;

      if (accessToken) {
        await instance.post(
          "/auth/logout",
          {},
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
      }
      setIsAuthenticated(false);
      setAuthTokens(null);
      setUser(null);
      localStorage.removeItem("authTokens");
      localStorage.removeItem("user");
      toast.success("Log out successfully", { duration: 2000 });
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error.message);
      toast.error(error?.response?.data?.message || "Failed to log out", {
        duration: 2000,
      });
    }
  };

  const getRoleName = async (id) => {
    try {
      const response = await instance.get(`/userRole/${id}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.data.roleName;
    } catch (error) {}
  };

  const contextData = {
    user: user,
    authTokens: authTokens,
    setAuthTokens: setTokens,
    setIsAuthenticated: setIsAuthenticated,
    isAuthenticated: isAuthenticated,
    getRoleName: getRoleName,
    setUser: setUser,
    signup: signup,
    logout: logout,
  };

  useEffect(() => {
    if (authTokens) {
      setUser(jwtDecode(authTokens.accessToken));
      setIsAuthenticated(true);
    } else {
      setUser(null);
      setIsAuthenticated(false);
    }
  }, [authTokens]);

  return (
    <AuthContext.Provider value={contextData}>{children}</AuthContext.Provider>
  );
};
