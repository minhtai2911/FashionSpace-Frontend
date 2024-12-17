import instance from "../services/axiosConfig";
import Cookies from "js-cookie";

export const getAllOrders = async (
  orderTrackingStatus,
  paymentMethod,
  paymentStatus
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

    const params = new URLSearchParams();

    if (orderTrackingStatus) {
      params.append("orderTrackingStatus", orderTrackingStatus);
    }

    if (paymentMethod) {
      params.append("paymentMethod", paymentMethod);
    }

    if (paymentStatus) {
      params.append("paymentStatus", paymentStatus);
    }

    const accessToken = tokenResponse.data.accessToken;
    const response = await instance.get(`/order?${params.toString()}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data.data;
  } catch (error) {
    return null;
  }
};

export const getOrderById = async (id) => {
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
    const response = await instance.get(`/order/${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data.data;
  } catch (error) {
    return null;
  }
};

export const getOrderByUserId = async (userId) => {
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
    const response = await instance.get(
      "/order/get/userId",
      {
        id: userId,
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

export const createOrder = async (
  total,
  paymentDetailId,
  orderAddressId,
  shippingFee
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
      "/order",
      {
        total,
        paymentDetailId,
        orderAddressId,
        shippingFee,
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

export const updateOrderById = async (
  status,
  deliveryDate,
  currentAddress,
  id
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
      `/order/${id}`,
      {
        status: status,
        deliveryDate: deliveryDate,
        currentAddress: currentAddress,
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
