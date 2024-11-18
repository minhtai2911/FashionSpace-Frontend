import axios from "axios";
import { jwtDecode } from "jwt-decode";
import dayjs from "dayjs";
import Cookies from "js-cookie";

const baseURL = "http://localhost:8000/api/v1";

const instance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

instance.interceptors.request.use(async (req) => {
  let accessToken = Cookies.get("accessToken");

  if (req.url.includes("/auth/login") || req.url.includes("/auth/signup")) {
    return req;
  }

  if (accessToken) {
    const user = jwtDecode(accessToken);
    const isExpired = dayjs.unix(user.exp).diff(dayjs()) < 1;

    if (!isExpired) {
      req.headers.Authorization = `Bearer ${accessToken}`;
      return req;
    }
  }

  const refreshToken = Cookies.get("refreshToken");
  if (refreshToken) {
    try {
      const response = await axios.post(`${baseURL}/auth/refreshToken`, {
        refreshToken,
      });
      const newAccessToken = response.data.accessToken;

      Cookies.set("accessToken", newAccessToken);
      req.headers.Authorization = `Bearer ${newAccessToken}`;
      return req;
    } catch (error) {
      console.error("Token refresh failed:", error);
      Cookies.remove("accessToken");
      Cookies.remove("refreshToken");
      window.location.href = "/login";
      return Promise.reject(error);
    }
  } else {
    console.log("No refresh token found");
  }
  return req;
});

// instance.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;
//     if (error.response.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;
//       try {
//         const response = await axios.post("/auth/refreshToken");
//         const { accessToken } = response.data;
//         localStorage.setItem("authTokens", accessToken);
//         originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
//         return axios(originalRequest);
//       } catch (refreshError) {
//         console.error("Token refresh failed:", refreshError);
//         localStorage.removeItem("token");
//         localStorage.removeItem("refreshToken");
//         window.location.href = "/login";
//         return Promise.reject(refreshError);
//       }
//     }
//     return Promise.reject(error);
//   }
// );

export default instance;
