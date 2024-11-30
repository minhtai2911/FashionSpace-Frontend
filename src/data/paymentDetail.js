import instance from "../services/axiosConfig";
import Cookies from "js-cookie";

export const createPaymentDetail = async (paymentMethod, status) => {
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
      "/paymentDetail",
      {
        paymentMethod: paymentMethod,
        status: status,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    return null;
  }
};

export const getPaymentDetailById = async (id) => {
  try {
    const response = await instance.get(`/paymentDetail/${id}`);
    return response.data;
  } catch (error) {
    return null;
  }
};
