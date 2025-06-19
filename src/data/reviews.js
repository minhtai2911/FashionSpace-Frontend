import instance from "../services/axiosConfig";
import Cookies from "js-cookie";

export const getAllReviews = async (
  page = 1,
  limit = 10,
  status,
  rating,
  isActive,
  productId,
  userId,
  orderId
) => {
  try {
    const params = new URLSearchParams();

    // Add pagination parameters
    params.append("page", page);
    params.append("limit", limit);

    // Add filter parameters
    if (status && status !== "All") {
      params.append("status", status);
    }

    if (rating && rating !== "All") {
      params.append("rating", rating);
    }

    if (isActive !== undefined && isActive !== null) {
      params.append("isActive", isActive);
    }

    if (productId) {
      params.append("productId", productId);
    }

    if (userId) {
      params.append("userId", userId);
    }

    if (orderId) {
      params.append("orderId", orderId);
    }

    const response = await instance.get(`/review?${params.toString()}`, {
      requiresAuth: false,
    });
    return {
      data: response.data.data,
      meta: response.data.meta,
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getReviewsByProductId = async (productId) => {
  try {
    const response = await instance.get(`/review/productId/${productId}`, {
      requiresAuth: false,
    });
    return response.data.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getReviewById = async (id) => {
  try {
    const response = await instance.get(`/review/${id}`, {
      requiresAuth: false,
    });
    return response.data.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getReviewByProductIdAndUserId = async (productId) => {
  // const refreshToken = Cookies.get("refreshToken");
  try {
    // const tokenResponse = await instance.post(
    //   "/auth/refreshToken",
    //   {
    //     refreshToken: refreshToken,
    //   },
    //   {
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //   }
    // );
    // const accessToken = tokenResponse.data.data.accessToken;
    // Cookies.set("refreshToken", tokenResponse.data.data.refreshToken);
    const response = await instance.get(
      `/review/${productId}/productIdAndUserId`,
      { requiresAuth: false }
    );
    return response.data.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const createReview = async (productId, rating, content, orderId) => {
  // const refreshToken = Cookies.get("refreshToken");
  try {
    // const tokenResponse = await instance.post(
    //   "/auth/refreshToken",
    //   {
    //     refreshToken: refreshToken,
    //   },
    //   {
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //   }
    // );
    // const accessToken = tokenResponse.data.data.accessToken;
    // Cookies.set("refreshToken", tokenResponse.data.data.refreshToken);
    const response = await instance.post(
      "/review",
      {
        productId,
        rating,
        content,
        orderId,
      },
      { requiresAuth: true }
      // {
      //   headers: {
      //     Authorization: `Bearer ${accessToken}`,
      //   },
      // }
    );
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

// export const getReviewsNotReplied = async () => {
//   try {
//     const response = await instance.get("/review/reviews/notReplied");
//     return response.data.data;
//   } catch (error) {
//     console.log(error);
//     throw error;
//   }
// };

// export const getReviewsReplied = async () => {
//   try {
//     const response = await instance.get("/review/reviews/replied");
//     return response.data.data;
//   } catch (error) {
//     console.log(error);
//     throw error;
//   }
// };

export const hideReview = async (id) => {
  try {
    const response = await instance.put(`/review/hide/${id}`, {
      requiresAuth: true,
    });
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

export const unhideReview = async (id) => {
  try {
    const response = await instance.put(`/review/unhide/${id}`, {
      requiresAuth: true,
    });
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

export const updateReview = async (id, rating, content) => {
  // const refreshToken = Cookies.get("refreshToken");
  try {
    // const tokenResponse = await instance.post(
    //   "/auth/refreshToken",
    //   {
    //     refreshToken: refreshToken,
    //   },
    //   {
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //   }
    // );
    // const accessToken = tokenResponse.data.data.accessToken;
    // Cookies.set("refreshToken", tokenResponse.data.data.refreshToken);
    const response = await instance.put(
      `/review/${id}`,
      {
        rating: rating,
        content: content,
      },
      { requiresAuth: true }
      // {
      //   headers: {
      //     Authorization: `Bearer ${accessToken}`,
      //   },
      // }
    );
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

export const createReviewResponse = async (reviewId, content) => {
  // const refreshToken = Cookies.get("refreshToken");
  try {
    // const tokenResponse = await instance.post(
    //   "/auth/refreshToken",
    //   {
    //     refreshToken: refreshToken,
    //   },
    //   {
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //   }
    // );
    // const accessToken = tokenResponse.data.data.accessToken;
    // Cookies.set("refreshToken", tokenResponse.data.data.refreshToken);
    const response = await instance.post(
      "/review/response",
      {
        reviewId: reviewId,
        content: content,
      },
      { requiresAuth: true }
      // {
      //   headers: {
      //     Authorization: `Bearer ${accessToken}`,
      //   },
      // }
    );
    return response.data.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
