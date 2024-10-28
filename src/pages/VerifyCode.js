import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import useAxios from "../services/useAxios";
import axios from "axios";

function VerifyCode() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const authTokens = localStorage.getItem("authTokens")
    ? JSON.parse(localStorage.getItem("authTokens"))
    : null;
  const location = useLocation();
  const { email } = location.state;
  const api = useAxios();

  const handleChange = (index, value) => {
    if (value === "" || /^[0-9]$/.test(value)) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);

      if (value !== "" && index < code.length - 1) {
        const nextInput = document.getElementById(`input-${index + 1}`);
        if (nextInput) {
          nextInput.focus();
        }
      }
    }
  };
  const handleKeyDown = (index, event) => {
    if (event.key === "Backspace" && code[index] === "" && index > 0) {
      const prevInput = document.getElementById(`input-${index - 1}`);
      if (prevInput) {
        prevInput.focus();
      }
    }
  };
  const handleSubmit = async () => {
    const verificationCode = code.join("");
    try {
      const response = await api.post("/auth/checkOTPByEmail", {
        email: email,
        OTP: verificationCode,
      });
      if (response.status === 200) {
        navigate("/set-password");
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleResendCode = async () => {};

  return (
    <div className="px-40 items-center h-screen flex gap-x-10">
      <div className="flex-1">
        <p className="font-semibold text-3xl">Verify Code</p>
        <p className="mt-2">
          Please enter the code we sent to email <b>{email}</b>
        </p>
        <div className="mt-4">
          <div className="flex flex-row justify-between gap-x-5">
            {code.map((digit, index) => (
              <input
                key={index}
                id={`input-${index}`}
                className="px-5 py-3 mt-2 border text-center rounded-lg text-2xl w-20 h-20"
                type="number"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
              />
            ))}
          </div>
        </div>
        {error && <p className="text-red-500">{error}</p>}
        <button
          onClick={handleSubmit}
          className="bg-[#0A0A0A] w-[100%] py-3 rounded-lg mt-8 text-white font-semibold text-lg"
        >
          Verify
        </button>
        <p className="mt-6 text-center">
          Didn't receive verification code?{" "}
          <button onClick={handleResendCode}>
            <u>Resend code</u>
          </button>
        </p>
      </div>
      <div className="flex-1">
        <img
          className="object-contain w-full h-auto"
          style={{ maxHeight: "calc(100vh - 64px)" }}
          src={require("../assets/images/products/women/jackets/baddie_jacket_1.jpg")}
        ></img>
      </div>
    </div>
  );
}

export default VerifyCode;
