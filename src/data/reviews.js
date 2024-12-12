import instance from "../services/axiosConfig";
import Cookies from "js-cookie";

export const getAllReviews = async () => {
  try {
    const response = await instance.get("/review");
    return response.data.data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getReviewsByProductId = async (productId) => {
  try {
    const response = await instance.get(`/review/productId/${productId}`);
    return response.data.data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getReviewById = async (id) => {
  try {
    const response = await instance.get(`/review/${id}`);
    return response.data.data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const createReview = async (productId, rating, content) => {
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
      "/review",
      {
        productId: productId,
        rating: rating,
        content: content,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data.data;
  } catch (error) {
    return null;
  }
};
