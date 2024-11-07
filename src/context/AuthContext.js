import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import instance from "../services/axiosConfig";
import { jwtDecode } from "jwt-decode";
import useAxios from "../services/useAxios";

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
      return response.data;
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  };

  const signup = async (email, fullName, phone, password) => {
    setIsLoading(true);
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
      console.log(response);
      if (response.status === 201) {
        const otpResponse = await instance.post(
          "/auth/generateOTP",
          { email: email },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const { otp } = otpResponse.data;
        if (otpResponse.status === 200) {
          const sendMail = await instance.post(
            "/auth/sendOTP",
            { email: email, OTP: otp },
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          if (sendMail.status === 200) {
            navigate("/verify-code", { state: { email } });
          }
        }
      }
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
