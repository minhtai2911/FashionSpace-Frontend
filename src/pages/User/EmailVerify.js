import { useEffect, useState, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import { AuthContext } from "../../context/AuthContext";
import Error from "../Error";
import instance from "../../services/axiosConfig";

const EmailVerify = () => {
  const { setIsAuthenticated, setUser, setAuthTokens } =
    useContext(AuthContext);
  const [validUrl, setValidUrl] = useState(true);
  const [redirectTimer, setRedirectTimer] = useState(5);
  const [error, setError] = useState(null);
  const param = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const verifyEmailUrl = async () => {
      try {
        const response = await instance.get(`/auth/verifyAccount/${param.id}`, {
          headers: { "Content-Type": "application/json" },
        });
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
        setValidUrl(true);
      } catch (error) {
        setError(error);
        setValidUrl(false);
      }
    };
    verifyEmailUrl();

    let timer;
    let redirectTimeout;
    if (!error) {
      timer = setInterval(() => {
        setRedirectTimer((prev) => prev - 1);
      }, 1000);

      redirectTimeout = setTimeout(() => {
        navigate("/");
      }, 5000);
    }

    return () => {
      clearInterval(timer);
      clearTimeout(redirectTimeout);
    };
  }, []);

  return validUrl && !error ? (
    <div className="w-screen h-screen flex flex-col justify-center items-center">
      <svg
        width="80"
        height="80"
        viewBox="0 0 80 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M5 28.9004V57.5004C5 60.1526 6.05357 62.6961 7.92893 64.5715C9.8043 66.4468 12.3478 67.5004 15 67.5004H65C67.6522 67.5004 70.1957 66.4468 72.0711 64.5715C73.9464 62.6961 75 60.1526 75 57.5004V28.9004L45.24 47.2104C43.6641 48.1799 41.8502 48.6932 40 48.6932C38.1498 48.6932 36.3359 48.1799 34.76 47.2104L5 28.9004Z"
          fill="black"
        />
        <path
          d="M75 23.0267V22.5C75 19.8478 73.9464 17.3043 72.0711 15.4289C70.1957 13.5536 67.6522 12.5 65 12.5H15C12.3478 12.5 9.8043 13.5536 7.92893 15.4289C6.05357 17.3043 5 19.8478 5 22.5V23.0267L37.38 42.9533C38.1679 43.4381 39.0749 43.6947 40 43.6947C40.9251 43.6947 41.8321 43.4381 42.62 42.9533L75 23.0267Z"
          fill="black"
        />
      </svg>

      <h1 className="font-medium text-4xl mt-8 text-center">
        Congratulations!
        <br />
        <p className="mt-2">Your email address has been verified</p>
      </h1>
      <p className="mt-8 mb-14 ml-auto mr-auto max-w-96 text-center text-[#9E9E9E]">
        Redirecting to Home in {redirectTimer}s...
      </p>
    </div>
  ) : (
    <Error
      errorCode={error.status}
      title={"It looks like something went wrong."}
      content="Don't worry, our team is already on it. Please try refreshing the page
        or come back later."
    />
  );
};

export default EmailVerify;
