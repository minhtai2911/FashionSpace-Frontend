import axios from "axios";
import { jwtDecode } from "jwt-decode";
import dayjs from "dayjs";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const baseURL = "http://localhost:8000/api/v1";

const useAxios = () => {
  const { authTokens, setUser, setAuthTokens } = useContext(AuthContext);
  const instance = axios.create({
    baseURL,
    headers: { Authorization: `Bearer ${authTokens?.accessToken}` },
  });
  instance.interceptors.request.use(async (req) => {
    if (authTokens) {
      const user = jwtDecode(authTokens.accessToken);
      const isExpired = dayjs.unix(user.exp).diff(dayjs()) < 1;

      if (!isExpired) return req;

      const response = await axios.post(`${baseURL}/auth/refreshToken`, {
        refreshToken: authTokens.refreshToken,
      });

      let newAccessToken = response.data.accessToken;
      let newRefreshToken = authTokens.refreshToken;

      localStorage.setItem(
        "authTokens",
        JSON.stringify({
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
        })
      );

      setAuthTokens({
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      });
      setUser(jwtDecode(newAccessToken));

      req.headers.Authorization = `Bearer ${newAccessToken}`;
    } else {
      console.error("No auth tokens");
    }
    return req;
  });
  return instance;
};

export default useAxios;
