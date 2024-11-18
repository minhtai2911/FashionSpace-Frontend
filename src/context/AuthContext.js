import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import instance from "../services/axiosConfig";
import { jwtDecode } from "jwt-decode";
import toast from "react-hot-toast";
import Cookies from "js-cookie";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState();
  const navigate = useNavigate();

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
    try {
      const refreshToken = Cookies.get("refreshToken");
      const response = await instance.post(
        "/auth/refreshToken",
        {
          refreshToken: refreshToken,
        },
        { headers: { "Content-Type": "application/json" } }
      );
      const accessToken = response.data.accessToken;
      if (accessToken) {
        const response = await instance.post("/auth/logout", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        });
        if (response.status === 200) {
          setIsAuthenticated(false);
          setUser(null);
          localStorage.removeItem("carts");
          Cookies.remove("accessToken");
          Cookies.remove("refreshToken");
          Cookies.remove("user");
          toast.success("Log out successfully", { duration: 2000 });
          navigate("/login");
        }
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Failed to log out", {
        duration: 2000,
      });
    }
  };

  const getUserById = async (id) => {
    try {
      const refreshToken = Cookies.get("refreshToken");
      const tokenResponse = await instance.post(
        "/auth/refreshToken",
        { refreshToken: refreshToken },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const accessToken = tokenResponse.data.accessToken;
      const response = await instance.get(`/user/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return response.data;
    } catch (error) {
      console.log(error);
    }
  };

  const contextData = {
    user: user,
    setIsAuthenticated: setIsAuthenticated,
    isAuthenticated: isAuthenticated,
    setUser: setUser,
    signup: signup,
    logout: logout,
    getUserById: getUserById,
  };

  useEffect(() => {
    const accessToken = Cookies.get("accessToken");
    if (accessToken) {
      setUser(jwtDecode(accessToken));
      setIsAuthenticated(true);
    } else {
      setUser(null);
      setIsAuthenticated(false);
    }
  }, []);

  return (
    <AuthContext.Provider value={contextData}>{children}</AuthContext.Provider>
  );
};
