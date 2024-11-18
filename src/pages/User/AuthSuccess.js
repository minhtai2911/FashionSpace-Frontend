import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "react-hot-toast";
import instance from "../../services/axiosConfig";
import axios from "axios";

function AuthSuccess() {
  const { setUser, setIsAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  let email;
  let hashId;
  const location = useLocation();

  useEffect(() => {
    const handleAuthSuccess = async () => {
      const url = location.pathname;
      const regex = /\/success\/([^\/]+)\/(.+)/;
      const match = url.match(regex);

      email = match[1];
      hashId = match[2];
      console.log(typeof email, typeof hashId);

      try {
        const response = await instance.post(
          "http://localhost:8000/api/v1/auth/loginGoogleSuccess",
          {
            email,
            token: hashId,
          }
        );
        const { refreshToken, ...data } = response.data.data;
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
        setUser(jwtDecode(accessToken));
        setIsAuthenticated(true);
        Cookies.set("accessToken", accessToken);
        Cookies.set("refreshToken", refreshToken);
        Cookies.set("user", JSON.stringify(jwtDecode(accessToken)));
        navigate("/");
      } catch (error) {
        toast.error(error?.response?.data?.message || "An error occured", {
          duration: 2000,
        });
        navigate("/login");
      }
    };
    handleAuthSuccess();
  }, []);

  return <div>oke</div>;
}

export default AuthSuccess;
