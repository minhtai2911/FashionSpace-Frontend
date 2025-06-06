import instance from "../services/axiosConfig";
import Cookies from "js-cookie";

export const getRelatedProducts = async () => {
  try {
    const response = await instance.get("/recommendation/for-you", {
      requiresAuth: true,
    });
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

export const getSimilarProducts = async (producId) => {
  try {
    const response = await instance.get(`/recommendation/similar/${producId}`, {
      requiresAuth: false,
    });
    return response.data.data;
  } catch (error) {
    throw error;
  }
};
