import axios from "axios";
import { jwtDecode } from "jwt-decode";
import dayjs from "dayjs";

const baseURL = "http://localhost:8000/api/v1";

let authTokens = localStorage.getItem("authTokens")
  ? JSON.parse(localStorage.getItem("authTokens"))
  : null;

const instance = axios.create({
  baseURL,
  headers: {
    Authorization: `Bearer ${authTokens?.accessToken}`,
  },
});

instance.interceptors.request.use(async (req) => {
  if (!authTokens) {
    authTokens = localStorage.getItem("authTokens")
      ? JSON.parse(localStorage.getItem("authTokens"))
      : null;

    if (req.url.includes("/auth/login") || req.url.includes("/auth/signup")) {
      return req;
    }

    req.headers.Authorization = `Bearer ${authTokens?.accessToken}`;
  }

  if (authTokens) {
    const user = jwtDecode(authTokens.accessToken);
    const isExpired = dayjs.unix(user.exp).diff(dayjs()) < 1;

    if (!isExpired) return req;

    const response = await axios.post(`${baseURL}/auth/refreshToken`, {
      refreshToken: authTokens.refreshToken,
    });

    let accessToken = response.data;
    let refreshToken = authTokens.refreshToken;

    localStorage.setItem(
      "authTokens",
      JSON.stringify({ accessToken, refreshToken })
    );
    req.headers.Authorization = `Bearer ${accessToken}`;
  } else {
    console.log("No auth tokens found");
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
