import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAxios from "../../services/useAxios";
import axios from "axios";
import LoadingOverlay from "../../components/LoadingOverlay";

function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const authTokens = localStorage.getItem("authTokens")
    ? JSON.parse(localStorage.getItem("authTokens"))
    : null;
  const api = useAxios();
  const handleSubmit = async () => {
    setIsLoading(true);
    if (!email) {
      setError("Please enter your email!");
      return;
    }

    try {
      const response = await api.post(
        "/auth/checkEmail",
        { email: email },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = response.data;
      if (response.status === 200) {
        const otpResponse = await api.post(
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
          const sendMail = await api.post(
            "/auth/sendOTP",
            { email: email, OTP: otp },
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          if (sendMail.status === 200) {
            setIsLoading(false);
            navigate("/verify-code", { state: { email } });
          }
        }
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError("Something went wrong. Please try again!");
    }
  };

  return (
    <>
      {isLoading && <LoadingOverlay content={"Sending email..."} />}
      <div className="px-40 items-center h-screen flex gap-x-10">
        <div className="flex-1">
          <p className="font-semibold text-3xl">Forgot Password?</p>
          <p className="mt-2">
            Don't worry. We'll sent you reset instructions.
          </p>
          <div className="mt-8">
            <p className="font-medium text-base">
              Email <b className="text-red-500">*</b>
            </p>
            <input
              className="px-5 py-3 mt-2 border rounded-lg text-sm w-[100%]"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            ></input>
          </div>
          {error && <p className="text-red-500">{error}</p>}
          <button
            onClick={handleSubmit}
            className="bg-[#0A0A0A] w-[100%] py-3 rounded-lg mt-8 text-white font-semibold text-lg"
          >
            Submit
          </button>
          <p className="mt-6 text-center">
            Remember password?{" "}
            <Link to="/login">
              <u>Sign In</u>
            </Link>
          </p>
        </div>
        <div className="flex-1">
          <img
            className="object-contain w-full h-auto"
            style={{ maxHeight: "calc(100vh - 64px)" }}
            src={require("../../assets/images/products/women/jackets/baddie_jacket_1.jpg")}
          ></img>
        </div>
      </div>
    </>
  );
}

export default ForgotPassword;
