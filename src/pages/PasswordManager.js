import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import Cookies from "js-cookie";

import toast from "react-hot-toast";
import instance from "../services/axiosConfig";

export default function PasswordManager() {
  const { user } = useContext(AuthContext);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const passwordPattern =
      /^(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      toast.error("Please fill in all fields", { duration: 2000 });
      return;
    }
    if (!passwordPattern.test(newPassword)) {
      toast.error(
        "Password must be at least 8 characters long, contain at least one number and one special character",
        { duration: 2000 }
      );
      return;
    }
    if (newPassword !== confirmNewPassword) {
      toast.error("New passwords do not match", { duration: 2000 });
      return;
    }

    try {
      const refreshToken = Cookies.get("refreshToken");
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
      const id = user.id;
      const response = await instance.post(
        `/auth/resetPassword`,
        {
          password: currentPassword,
          newPassword: newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success("Update password successfully", { duration: 2000 });
        setCurrentPassword("");
        setNewPassword("");
        setConfirmNewPassword("");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred", {
        duration: 2000,
      });
    }
  };

  return (
    <div className="w-[600px]">
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-base font-semibold mb-1">
            Password <b className="text-red-500">*</b>
          </label>
          <input
            type="password"
            className="px-5 py-3 border rounded-lg w-full"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-base font-semibold mb-1">
            New Password <b className="text-red-500">*</b>
          </label>
          <input
            type="password"
            className="px-5 py-3 border rounded-lg w-full"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-base font-semibold mb-1">
            Confirm New Password <b className="text-red-500">*</b>
          </label>
          <input
            type="password"
            className="px-5 py-3 border rounded-lg w-full"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="bg-black text-white mt-3 font-semibold px-10 py-3 rounded-lg hover:bg-gray-800"
        >
          Update Password
        </button>
      </form>
    </div>
  );
}
