import { useEffect, useState, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import instance from "../../services/axiosConfig";

function VerifyCode() {
  const navigate = useNavigate();
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(60);
  const authTokens = localStorage.getItem("authTokens")
    ? JSON.parse(localStorage.getItem("authTokens"))
    : null;
  const location = useLocation();
  const { email } = location.state;
  const inputRef = useRef(null);

  useEffect(() => {
    if (timer > 0) {
      const countdown = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(countdown);
    }
  }, [timer]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

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
      const response = await instance.post("/auth/checkOTPByEmail", {
        email: email,
        OTP: verificationCode,
      });
      if (response.status === 200) {
        toast.success("Verify successfully", { duration: 2000 });
        const { refreshToken } = response.data.data;
        navigate("/setPassword", { state: { refreshToken } });
      }
    } catch (error) {
      toast.error(error.response.data.message, { duration: 2000 });
    }
  };
  const handleResendCode = async () => {
    try {
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
      await toast.promise(
        instance.post("/auth/sendOTP", { email: email, OTP: otp }),
        {
          loading: "Sending OTP...",
          success: "OTP sent successfully",
          error: "Failed to send OTP",
        }
      );
      setTimer(60);
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "An error occured", {
        duration: 2000,
      });
    }
  };

  return (
    <div className="px-40 items-center h-screen flex gap-x-10">
      <div className="flex-1">
        <p className="font-semibold text-3xl">Verify Code</p>
        <p className="mt-2">
          Please enter the code we sent to email <b>{email}</b>
        </p>
        <div className="mt-2 flex flex-row gap-x-2">
          {timer > 0 ? (
            <p>
              The verification code will expire in: <b>{timer}s</b>
            </p>
          ) : (
            <p>The verification code has been expired</p>
          )}
        </div>
        <div className="mt-4">
          <div className="flex flex-row justify-between gap-x-5">
            {code.map((digit, index) => (
              <input
                key={index}
                id={`input-${index}`}
                ref={index === 0 ? inputRef : null}
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
        <button
          onClick={handleSubmit}
          className="bg-[#0A0A0A] w-[100%] py-3 rounded-lg mt-8 text-white font-semibold text-lg"
        >
          Verify
        </button>
        <p className="mt-6 text-center">
          Didn't receive verification code?{" "}
          <button
            className="cursor-pointer disabled:cursor-not-allowed"
            onClick={handleResendCode}
            disabled={timer > 0}
          >
            <u className="hover:text-[#818181]">Resend code</u>
          </button>
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
  );
}

export default VerifyCode;
