import instance from "../services/axiosConfig";
import Cookies from "js-cookie";

export const getAllReviews = async () => {
  try {
    const response = await instance.get("/review");
    return response.data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getReviewsByProductId = async (productId) => {
  try {
    const response = await instance.get(`/review/productId/${productId}`);
    return response.data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getReviewById = async (id) => {
  try {
    const response = await instance.get(`/review/${id}`);
    return response.data;
  } catch (error) {
    console.log(error);
    return null;
  }
};
