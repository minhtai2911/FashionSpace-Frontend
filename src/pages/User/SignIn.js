import { useState, useContext, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Cookies from "js-cookie";
import { Toaster, toast } from "react-hot-toast";

import { AuthContext } from "../../context/AuthContext";
import CheckBox from "../../components/CheckBox";
import { jwtDecode } from "jwt-decode";
import instance from "../../services/axiosConfig";
import { useDispatch, useSelector } from "react-redux";
import { mergeCart } from "../../stores/cart";
import { getShoppingCartByUserId } from "../../data/shoppingCart";
import { getProductVariantById } from "../../data/productVariant";
import { getUserRoleById } from "../../data/userRoles";

function SignIn() {
  const { setUser, isAuthenticated, setIsAuthenticated } =
    useContext(AuthContext);
  const navigate = useNavigate();
  const carts = useSelector((state) => state.cart.items);
  const [userCart, setUserCart] = useState([]);
  const dispatch = useDispatch();
  const location = useLocation();
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  if (isAuthenticated) {
    navigate("/");
  }

  const mergeUserCart = async (userId) => {
    try {
      const userCartData = await getShoppingCartByUserId(userId);
      if (userCartData) {
        const data = await Promise.all(
          userCartData.map(async (cart) => {
            const variant = await getProductVariantById(cart.productVariantId);
            const productId = variant.productId;
            const sizeId = variant.sizeId;
            const colorId = variant.colorId;
            const quantity = cart.quantity;
            return { productId, sizeId, colorId, quantity };
          })
        );
        dispatch(mergeCart(data));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await instance.post(
        "/auth/login",
        { email, password },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      toast.success("Login successfully", { duration: 1000 });
      const { accessToken, refreshToken, ...data } = response.data;

      setUser(jwtDecode(accessToken));
      setIsAuthenticated(true);

      Cookies.set("accessToken", accessToken);
      Cookies.set("refreshToken", refreshToken);
      Cookies.set("user", JSON.stringify(jwtDecode(accessToken)));
    } catch (error) {
      setIsAuthenticated(false);
      if (error.status === 400) {
        toast.error("Your account hasn't been verified");
        const id = error.response.data.data._id;
        const sendMailResponse = await instance.post(
          "/auth/sendMailVerifyAccount",
          {
            email: email,
            id: id,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      } else {
        toast.error(error.response.data.message);
      }
      throw error;
    }
  };

  const loginWithGoogle = async () => {
    window.open("http://localhost:8000/api/v1/auth/google", "_self");
  };

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!data.email || !data.password) {
      toast.error("Please fill in all fields", { duration: 2000 });
      return;
    }
    try {
      await login(data.email, data.password);
      const user = JSON.parse(Cookies.get("user"));
      const role = await getUserRoleById(user.roleId);
      if (role.roleName === "User") {
        await mergeUserCart(user.id);
        const state = location.state;
        if (state && state.orderSummary) {
          navigate("/checkout", {
            state: { orderSummary: state.orderSummary },
          });
        } else {
          navigate("/");
        }
      } else {
        navigate("/admin");
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has("error")) {
      const errorType = urlParams.get("error");
      if (errorType === "auth") {
        toast.error("Authentication failed. Please try again.", {
          duration: 2000,
        });
      }
    }
  });

  return (
    <div>
      <div className="px-40 items-center h-screen flex gap-x-10">
        <div className="flex-1">
          <p className="font-semibold text-3xl">Sign In</p>
          <form onSubmit={handleSubmit}>
            <div className="mt-4">
              <p className="font-medium text-base">
                Email <b className="text-red-500">*</b>
              </p>
              <input
                className="px-5 py-3 mt-2 border rounded-lg text-sm w-[100%]"
                name="email"
                type="email"
                value={data.email}
                onChange={handleChange}
              ></input>
            </div>
            <div className="mt-4">
              <p className="font-medium text-base">
                Password <b className="text-red-500">*</b>
              </p>
              <input
                className="px-5 py-3 mt-2 border rounded-lg text-sm w-[100%]"
                type="password"
                name="password"
                value={data.password}
                onChange={handleChange}
              ></input>
            </div>
            <div className="mt-4 flex flex-row items-center justify-between">
              <div className="flex-row gap-x-3 flex items-center">
                <CheckBox />
                <p className="text-base">Remember me</p>
              </div>
              <Link to="/forgotPassword" className="text-base">
                Forgot password?
              </Link>
            </div>
            <button
              type="submit"
              className="bg-[#0A0A0A] w-[100%] py-3 rounded-lg mt-8 text-white font-semibold text-lg"
            >
              Sign In
            </button>
          </form>

          <div className="flex flex-row justify-between items-center gap-x-10 mt-4">
            <div className="flex-1 h-[1px] bg-[#DEDEDE]"></div>
            <p className="text-[#818181]">or sign in with</p>
            <div className="flex-1 h-[1px] bg-[#DEDEDE]"></div>
          </div>
          <button
            className="mt-4 border border-[#0A0A0A] w-[100%] flex items-center justify-center py-3 rounded-lg"
            onClick={loginWithGoogle}
          >
            <div className="flex flex-row gap-x-3 items-center">
              <svg
                width="32"
                height="32"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M29.0743 13.3887H28.0003V13.3333H16.0003V18.6667H23.5357C22.4363 21.7713 19.4823 24 16.0003 24C11.5823 24 8.00033 20.418 8.00033 16C8.00033 11.582 11.5823 8 16.0003 8C18.0397 8 19.895 8.76934 21.3077 10.026L25.079 6.25467C22.6977 4.03534 19.5123 2.66667 16.0003 2.66667C8.63699 2.66667 2.66699 8.63667 2.66699 16C2.66699 23.3633 8.63699 29.3333 16.0003 29.3333C23.3637 29.3333 29.3337 23.3633 29.3337 16C29.3337 15.106 29.2417 14.2333 29.0743 13.3887Z"
                  fill="#FFC107"
                />
                <path
                  d="M4.2041 9.79401L8.58477 13.0067C9.7701 10.072 12.6408 8.00001 16.0001 8.00001C18.0394 8.00001 19.8948 8.76934 21.3074 10.026L25.0788 6.25467C22.6974 4.03534 19.5121 2.66667 16.0001 2.66667C10.8788 2.66667 6.43743 5.55801 4.2041 9.79401Z"
                  fill="#FF3D00"
                />
                <path
                  d="M15.9999 29.3333C19.4439 29.3333 22.5732 28.0153 24.9392 25.872L20.8126 22.38C19.4291 23.4327 17.7383 24.0019 15.9999 24C12.5319 24 9.58722 21.7887 8.47788 18.7027L4.12988 22.0527C6.33655 26.3707 10.8179 29.3333 15.9999 29.3333Z"
                  fill="#4CAF50"
                />
                <path
                  d="M29.074 13.3887H28V13.3333H16V18.6667H23.5353C23.0095 20.1443 22.0622 21.4354 20.8107 22.3807L20.8127 22.3793L24.9393 25.8713C24.6473 26.1367 29.3333 22.6667 29.3333 16C29.3333 15.106 29.2413 14.2333 29.074 13.3887Z"
                  fill="#1976D2"
                />
              </svg>
              <p className="font-medium">Sign in with Google</p>
            </div>
          </button>
          <p className="mt-4 text-center">
            Don't have an account?{" "}
            <Link to="/signup">
              <u>Sign Up</u>
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
    </div>
  );
}

export default SignIn;
