import instance from "../services/axiosConfig";
import Cookies from "js-cookie";

export const getProductVariantsByProductId = async (productId) => {
  try {
    const response = await instance.get(
      `/productVariant/productId/${productId}`
    );
    return response.data;
  } catch (error) {
    return null;
  }
};

export const createProductVariant = async (
  productId,
  sizeId,
  colorId,
  quantity
) => {
  const refreshToken = Cookies.get("refreshToken");
  try {
    const tokenResponse = await instance.post(
      "/auth/refreshToken",
      {
        refreshToken: refreshToken,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const accessToken = tokenResponse.data.accessToken;
    const response = await instance.post(
      "/productVariant",
      {
        productId: productId,
        sizeId: sizeId,
        colorId: colorId,
        quantity: quantity,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const updateProductVariant = async (
  id,
  productId,
  sizeId,
  colorId,
  quantity
) => {
  const refreshToken = Cookies.get("refreshToken");
  try {
    const tokenResponse = await instance.post(
      "/auth/refreshToken",
      {
        refreshToken: refreshToken,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const accessToken = tokenResponse.data.accessToken;
    const response = await instance.put(
      `/productVariant/${id}`,
      {
        productId: productId,
        sizeId: sizeId,
        colorId: colorId,
        quantity: quantity,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const deleteProductVariant = async (id) => {
  const refreshToken = Cookies.get("refreshToken");
  try {
    const tokenResponse = await instance.post(
      "/auth/refreshToken",
      {
        refreshToken: refreshToken,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const accessToken = tokenResponse.data.accessToken;
    const response = await instance.delete(`/productVariant/${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.log(error);
    return null;
  }
};
