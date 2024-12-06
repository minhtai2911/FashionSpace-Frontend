import instance from "../services/axiosConfig";
import Cookies from "js-cookie";

export const getReviewResponseByReviewId = async (reviewId) => {
  try {
    const response = await instance.get(`/reviewResponse/reviewId/${reviewId}`);
    return response.data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const createReviewResponse = async (reviewId, content) => {
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
      "/reviewResponse",
      {
        reviewId: reviewId,
        content: content,
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
