import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useAxios from "../../services/useAxios";

function SetNewPassword() {
  const location = useLocation();
  const navigate = useNavigate();
  const { refreshToken } = location.state;
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const api = useAxios();

  const handleResetPassword = async () => {
    const passwordPattern =
      /^(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    if (!passwordPattern.test(password)) {
      setError(
        "Password must be at least 8 characters long, contain at least one number and one special character."
      );
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const tokenResponse = await api.post(
        "/auth/refreshToken",
        { refreshToken: refreshToken },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const accessToken = tokenResponse.data.accessToken;
      const response = await api.post(
        "/auth/forgotPassword",
        {
          newPassword: password,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (response.status === 200) {
        console.log("Password reset successfully!");
        navigate("/login");
      }
    } catch (error) {
      setError("Failed to reset password. Please try again.");
      console.log(error);
    }

    setError("");
  };

  return (
    <div className="px-40 items-center h-screen flex gap-x-10">
      <div className="flex-1">
        <p className="font-semibold text-3xl">Set new password</p>
        {error && <p className="text-red-500 mt-2">{error}</p>}
        <div className="mt-8">
          <p className="font-medium text-base">
            Password <b className="text-red-500">*</b>
          </p>
          <input
            className="px-5 py-3 mt-2 border rounded-lg text-sm w-[100%]"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></input>
        </div>
        <div className="mt-4">
          <p className="font-medium text-base">
            Confirm Password <b className="text-red-500">*</b>
          </p>
          <input
            className="px-5 py-3 mt-2 border rounded-lg text-sm w-[100%]"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          ></input>
        </div>
        <button
          className="bg-[#0A0A0A] w-[100%] py-3 rounded-lg mt-8 text-white font-semibold text-lg"
          onClick={handleResetPassword}
        >
          Reset Password
        </button>
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

export default SetNewPassword;
