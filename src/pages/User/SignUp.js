import { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import CheckBox from "../../components/CheckBox";
import { AuthContext } from "../../context/AuthContext";
import toast from "react-hot-toast";

function SignUp() {
  const { signup, isAuthenticated } = useContext(AuthContext);
  const [data, setData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [termsAndConditions, setTermsAndConditions] = useState(false);

  const navigate = useNavigate();
  if (isAuthenticated) {
    navigate("/");
    return null;
  }
  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleCheckboxChange = () => {
    setTermsAndConditions(!termsAndConditions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const passwordPattern =
      /^(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

    if (
      !data.fullName ||
      !data.email ||
      !data.phone ||
      !data.password ||
      !data.confirmPassword
    ) {
      toast.error("Please fill in all fields", { duration: 2000 });
      return;
    }
    if (!passwordPattern.test(data.password)) {
      toast.error(
        "Password must be at least 8 characters long, contain at least one number and one special character",
        {
          duration: 2000,
        }
      );
      return;
    }
    if (data.password !== data.confirmPassword) {
      toast.error("Passwords do not match", { duration: 2000 });
      return;
    }
    if (!termsAndConditions) {
      toast.error("Please agree to the terms and conditions", {
        duration: 2000,
      });
      return;
    }
    try {
      const response = await signup(
        data.email,
        data.fullName,
        data.phone,
        data.password
      );
    } catch (error) {
      toast.error(error?.response?.data?.message || "An error occured", {
        duration: 2000,
      });
    }
  };

  return (
    <>
      <div className="px-40 items-center h-screen flex gap-x-10 relative">
        <div className="flex-1">
          <p className="font-semibold text-3xl">Sign Up</p>
          <form onSubmit={handleSubmit}>
            <div className="flex-1 mt-4">
              <p className="font-medium text-base">
                Full Name <b className="text-red-500">*</b>
              </p>
              <input
                className="px-5 py-3 mt-2 border rounded-lg text-sm w-[100%] "
                placeholder="Enter your name"
                name="fullName"
                value={data.fullName}
                onChange={handleChange}
              />
            </div>
            <div className="mt-4 flex flex-row gap-x-10">
              <div className="flex-1">
                <p className="font-medium text-base">
                  Email <b className="text-red-500">*</b>
                </p>
                <input
                  className="px-5 py-3 mt-2 border rounded-lg text-sm w-[100%] border-[#E5E7EB] focus:border-[#0A0A0A] focus:ring-[#0A0A0A]"
                  placeholder="Enter your email"
                  name="email"
                  type="email"
                  value={data.email}
                  onChange={handleChange}
                />
              </div>
              <div className="flex-1">
                <p className="font-medium text-base">
                  Phone <b className="text-red-500">*</b>
                </p>
                <input
                  className="px-5 py-3 mt-2 border rounded-lg text-sm w-[100%]"
                  placeholder="Enter your phone"
                  name="phone"
                  value={data.phone}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="mt-4">
              <p className="font-medium text-base">
                Password <b className="text-red-500">*</b>
              </p>
              <input
                className="px-5 py-3 mt-2 border rounded-lg text-sm w-[100%] border-[#E5E7EB] focus:border-[#0A0A0A] focus:ring-[#0A0A0A]"
                type="password"
                name="password"
                value={data.password}
                onChange={handleChange}
              />
            </div>
            <div className="mt-4">
              <p className="font-medium text-base">
                Confirm Password <b className="text-red-500">*</b>
              </p>
              <input
                className="px-5 py-3 mt-2 border rounded-lg text-sm w-[100%] border-[#E5E7EB] focus:border-[#0A0A0A] focus:ring-[#0A0A0A]"
                type="password"
                name="confirmPassword"
                value={data.confirmPassword}
                onChange={handleChange}
              />
            </div>
            <div className="mt-4 flex-row gap-x-3 items-center flex">
              <CheckBox
                isChecked={termsAndConditions}
                onChange={handleCheckboxChange}
              />
              <p className="text-base">
                I agree with <u className="cursor-pointer">Terms & Condition</u>{" "}
                and <u className="cursor-pointer">Privacy Policy</u>
              </p>
            </div>
            <button
              type="submit"
              className="bg-[#0A0A0A] w-[100%] py-3 rounded-lg mt-4 text-white font-semibold text-lg"
            >
              Sign Up
            </button>
          </form>
          <p className="mt-4 text-center">
            Alreay have an account?{" "}
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

export default SignUp;
