import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useAxios from "../../services/useAxios";
import toast from "react-hot-toast";

function SetNewPassword() {
  const location = useLocation();
  const navigate = useNavigate();
  const { refreshToken } = location.state;
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const api = useAxios();

  const handleResetPassword = async () => {
    const passwordPattern =
      /^(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

    if (!password || !confirmPassword) {
      toast.error("Please fill in all fields", { duration: 2000 });
      return;
    }

    if (!passwordPattern.test(password)) {
      toast.error(
        "Password must be at least 8 characters long, contain at least one number and one special character",
        {
          duration: 2000,
        }
      );
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match", { duration: 2000 });
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
        toast.success("Password reset successfully!", { duration: 2000 });
        navigate("/login");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "An error occurred!", {
        duration: 2000,
      });
    }
  };

  return (
    <div className="px-40 items-center h-screen flex gap-x-10">
      <div className="flex-1">
        <p className="font-semibold text-3xl">Set new password</p>
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
