import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import instance from "../services/axiosConfig";
import { jwtDecode } from "jwt-decode";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import { useSelector, useDispatch } from "react-redux";
import { clearCart } from "../stores/cart";
import {
  getProductVariantById,
  getProductVariantByProductIdColorIdSizeId,
} from "../data/productVariant";
import {
  createShoppingCart,
  deleteShoppingCartById,
  getShoppingCartByUserId,
  getShoppingCartByUserIdProductVariantId,
  updateShoppingCartQuantityById,
} from "../data/shoppingCart";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    permission: null,
    isAuth: false,
  });
  const [user, setUser] = useState();
  const carts = useSelector((state) => state.cart.items);
  const [hasError, setHasError] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const signup = async (email, fullName, phone, password) => {
    try {
      const response = await instance.post(
        "/auth/signup",
        { email, fullName, phone, password },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      toast.success("Đăng ký thành công", { duration: 2000 });
      const id = response.data.data._id;
      const sendMailResponse = await toast.promise(
        instance.post(
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
        ),
        {
          loading: "Đang gửi email xác thực...",
          success: "Email xác thực được gửi thành công",
          error: "Gửi email xác thực thất bại",
        }
      );
      navigate("/login");
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Có lỗi xảy ra", {
        duration: 2000,
      });
    }
  };

  const createCart = async (currentCarts) => {
    const user = Cookies.get("user");
    try {
      const previousCarts = await getShoppingCartByUserId(user._id);

      const enrichedPreviousCarts = await Promise.all(
        previousCarts.map(async (item) => {
          const variantDetails = await getProductVariantById(
            item.productVariantId
          );
          console.log(variantDetails);
          return {
            ...item,
            productId: variantDetails.productId,
            colorId: variantDetails.colorId,
            sizeId: variantDetails.sizeId,
          };
        })
      );

      const addedItems = currentCarts.filter(
        (currentItem) =>
          !enrichedPreviousCarts.some(
            (prevItem) =>
              prevItem.productId === currentItem.productId &&
              prevItem.colorId === currentItem.colorId &&
              prevItem.sizeId === currentItem.sizeId
          )
      );

      const deletedItems = enrichedPreviousCarts.filter(
        (prevItem) =>
          !currentCarts.some(
            (currentItem) =>
              currentItem.productId === prevItem.productId &&
              currentItem.colorId === prevItem.colorId &&
              currentItem.sizeId === prevItem.sizeId
          )
      );

      const updatedItems = currentCarts.filter((currentItem) => {
        const matchingItem = enrichedPreviousCarts.find(
          (prevItem) =>
            prevItem.productId === currentItem.productId &&
            prevItem.colorId === currentItem.colorId &&
            prevItem.sizeId === currentItem.sizeId
        );
        return matchingItem && matchingItem.quantity !== currentItem.quantity;
      });

      const promises = [];

      addedItems.forEach((item) => {
        promises.push(
          getProductVariantByProductIdColorIdSizeId(
            item.productId,
            item.colorId,
            item.sizeId
          ).then((variantResponse) =>
            createShoppingCart(user._id, variantResponse._id, item.quantity)
          )
        );
      });

      deletedItems.forEach((item) => {
        promises.push(
          getProductVariantByProductIdColorIdSizeId(
            item.productId,
            item.colorId,
            item.sizeId
          ).then((variantResponse) =>
            getShoppingCartByUserIdProductVariantId(
              user._id,
              variantResponse._id
            ).then((shoppingCartResponse) =>
              deleteShoppingCartById(shoppingCartResponse._id)
            )
          )
        );
      });

      updatedItems.forEach((item) => {
        promises.push(
          getProductVariantByProductIdColorIdSizeId(
            item.productId,
            item.colorId,
            item.sizeId
          ).then((variantResponse) =>
            getShoppingCartByUserIdProductVariantId(
              user._id,
              variantResponse._id
            ).then((shoppingCartResponse) =>
              updateShoppingCartQuantityById(
                shoppingCartResponse._id,
                item.quantity
              )
            )
          )
        );
      });

      await Promise.all(promises);
    } catch (error) {
      console.log(error);
      toast.error("Đồng bộ giỏ hàng thất bại");
    }
  };

  const logout = async () => {
    try {
      const refreshToken = Cookies.get("refreshToken");
      const response = await instance.post(
        "/auth/refreshToken",
        {
          refreshToken: refreshToken,
        },
        { headers: { "Content-Type": "application/json" } }
      );
      const accessToken = response.data.accessToken;
      if (accessToken) {
        const response = await instance.post("/auth/logout", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        });
        if (response.status === 200) {
          setAuth({ permission: null, isAuth: false });
          setUser(null);
          await createCart(carts);
          dispatch(clearCart());
          Cookies.remove("carts");
          Cookies.remove("accessToken");
          Cookies.remove("refreshToken");
          Cookies.remove("permission");
          toast.success("Đăng xuất thành công", { duration: 2000 });
          navigate("/login");
          Cookies.remove("user");
        }
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Đăng xuất thất bại", {
        duration: 2000,
      });
    }
  };

  // const getUserById = async (id) => {
  //   try {
  //     const refreshToken = Cookies.get("refreshToken");
  //     const tokenResponse = await instance.post(
  //       "/auth/refreshToken",
  //       { refreshToken: refreshToken },
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     );
  //     const accessToken = tokenResponse.data.accessToken;
  //     const response = await instance.get(`/user/${id}`, {
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${accessToken}`,
  //       },
  //     });
  //     return response.data;
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const contextData = {
    user: user,
    setAuth: setAuth,
    auth: auth,
    setUser: setUser,
    signup: signup,
    logout: logout,
    createCart: createCart,
    hasError: hasError,
    setHasError: setHasError,
  };

  useEffect(() => {
    const accessToken = Cookies.get("accessToken");
    if (accessToken) {
      setUser(jwtDecode(accessToken));
      setAuth((prevAuth) => ({
        ...prevAuth,
        isAuth: true,
      }));
    } else {
      setUser(null);
      setAuth((prevAuth) => ({
        ...prevAuth,
        isAuth: false,
      }));
    }
  }, []);

  return (
    <AuthContext.Provider value={contextData}>{children}</AuthContext.Provider>
  );
};

export default AuthContext;
