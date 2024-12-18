import instance from "../services/axiosConfig";
import Cookies from "js-cookie";

export const getProductVariantsByProductId = async (productId) => {
  try {
    const response = await instance.get(
      `/productVariant/productId/${productId}`
    );
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

export const getProductVariantById = async (id) => {
  try {
    const response = await instance.get(`/productVariant/${id}`);
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

export const getProductVariantByProductIdColorIdSizeId = async (
  productId,
  colorId,
  sizeId
) => {
  try {
    const response = await instance.get(
      `/productVariant/${productId}/${colorId}/${sizeId}`
    );
    return response.data.data;
  } catch (error) {
    throw error;
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
    return response.data.data;
  } catch (error) {
    console.log(error);
    throw error;
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
    return response.data.data;
  } catch (error) {
    console.log(error);
    throw error;
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
    return response.data.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const deleteProductVariantsByProductId = async (id) => {
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
    const response = await instance.delete(`/productVariant/productId/${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
