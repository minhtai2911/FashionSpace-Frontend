import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { useContext } from "react";
import AuthContext from "../../context/AuthContext";
import { toast } from "react-hot-toast";
import instance from "../../services/axiosConfig";
import { mergeCart } from "../../stores/cart";
import {
  ADMIN_PERMISSIONS,
  CUSTOMER_PERMISSIONS,
  EMPLOYEE_PERMISSIONS,
} from "../../utils/Constants";
import { getShoppingCartByUserId } from "../../data/shoppingCart";
import { getProductVariantById } from "../../data/productVariant";
import { useDispatch } from "react-redux";
import { getUserRoleById } from "../../data/userRoles";

function AuthSuccess() {
  const { setUser, setAuth, setHasError } = useContext(AuthContext);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  let email;
  let hashId;
  const location = useLocation();

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

  useEffect(() => {
    const handleAuthSuccess = async () => {
      const url = location.pathname;
      const regex = /\/success\/([^\/]+)\/(.+)/;
      const match = url.match(regex);

      email = match[1];
      hashId = match[2];

      try {
        const response = await instance.post(
          "http://localhost:8000/api/v1/auth/loginGoogleSuccess",
          {
            email,
            token: hashId,
          }
        );
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
        setAuth((prevAuth) => ({ ...prevAuth, isAuth: true }));
        Cookies.set("accessToken", accessToken);
        Cookies.set("refreshToken", refreshToken);
        Cookies.set("user", JSON.stringify(jwtDecode(accessToken)));
        const user = jwtDecode(accessToken);
        setUser(user);
        const role = await getUserRoleById(user.roleId);
        setHasError(false);
        if (role.roleName === "Customer") {
          setAuth((prevAuth) => ({
            ...prevAuth,
            permission: CUSTOMER_PERMISSIONS,
          }));
          Cookies.set("permission", CUSTOMER_PERMISSIONS);
          await mergeUserCart(user.id);
          const state = location.state;
          if (state && state.orderSummary) {
            navigate("/checkout", {
              state: { orderSummary: state.orderSummary },
            });
          } else {
            navigate("/");
          }
        } else if (role.roleName === "Admin") {
          setAuth((prevAuth) => ({
            ...prevAuth,
            permission: ADMIN_PERMISSIONS,
          }));
          Cookies.set("permission", ADMIN_PERMISSIONS);
          navigate("/admin");
        } else if (role.roleName === "Employee") {
          setAuth((prevAuth) => ({
            ...prevAuth,
            permission: EMPLOYEE_PERMISSIONS,
          }));
          Cookies.set("permission", EMPLOYEE_PERMISSIONS);
          navigate("/admin/orders");
        }
      } catch (error) {
        toast.error(error?.response?.data?.message || "Có lỗi xảy ra", {
          duration: 2000,
        });
        navigate("/login");
      }
    };
    handleAuthSuccess();
  }, []);

  return <div></div>;
}

export default AuthSuccess;
