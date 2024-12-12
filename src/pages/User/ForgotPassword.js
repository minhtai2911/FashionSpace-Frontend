import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import instance from "../../services/axiosConfig";

function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const sendOtpAndNavigate = async () => {
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

    if (otpResponse.status === 200) {
      const sendMail = await instance.post(
        "/auth/sendOTP",
        { email: email, OTP: otp },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (sendMail.status === 200) {
        navigate("/verifyCode", { state: { email } });
      }
    }
  };

  const handleSubmit = async () => {
    if (!email) {
      toast.error("Vui lòng nhập email!", { duration: 2000 });
      return;
    }

    try {
      const response = await instance.post(
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
        toast.promise(
          sendOtpAndNavigate(),
          {
            loading: "Đang gửi mã OTP...",
            success: "Mã OTP được gửi thành công",
            error: "Gửi mã OTP thất bại",
          },
          { duration: 3000 }
        );
      } else {
        toast.error(response.data.message, { duration: 2000 });
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message, {
        duration: 2000,
      });
    }
  };

  return (
    <>
      <div className="px-40 items-center h-screen flex gap-x-10">
        <div className="flex-1">
          <p className="font-semibold text-3xl">Quên mật khẩu?</p>
          <p className="mt-2">
            Đừng lo lắng. Chúng tôi sẽ gửi hướng dẫn đặt lại mật khẩu cho bạn.
          </p>
          <div className="mt-8">
            <p className="font-medium text-base">
              Email <b className="text-red-500">*</b>
            </p>
            <input
              className="px-5 py-3 mt-2 border rounded-lg text-sm w-[100%]"
              placeholder="Nhập email của bạn"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            ></input>
          </div>
          <button
            onClick={handleSubmit}
            className="bg-[#0A0A0A] w-[100%] py-3 rounded-lg mt-8 text-white font-semibold text-lg"
          >
            Gửi
          </button>
          <p className="mt-6 text-center">
            Nhớ mật khẩu?{" "}
            <Link to="/login">
              <u>Đăng nhập</u>
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
