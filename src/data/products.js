import instance from "../services/axiosConfig";
import Cookies from "js-cookie";

export const getAllProducts = async () => {
  try {
    const response = await instance.get("/product");
    return response.data.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getNewArrivalProducts = async () => {
  try {
    const response = await instance.get("/product/get/newArrivalProduct");
    return response.data.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getBestSellerProducts = async () => {
  try {
    const response = await instance.get("/product/get/bestSellerProduct");
    return response.data.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getProductById = async (productId) => {
  try {
    const response = await instance.get(`/product/${productId}`);
    return response.data.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const createProduct = async (
  name,
  description,
  categoryId,
  price,
  rating = 0
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
      "/product",
      {
        name: name,
        description: description,
        categoryId: categoryId,
        price: price,
        rating: rating,
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

export const updateProduct = async (
  productId,
  name,
  description,
  categoryId,
  price,
  rating = 0
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
      `/product/${productId}`,
      {
        name: name,
        description: description,
        categoryId: categoryId,
        price: price,
        rating: rating,
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

export const archiveProductById = async (id) => {
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
    const response = await instance.delete(`/product/${id}`, {
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
