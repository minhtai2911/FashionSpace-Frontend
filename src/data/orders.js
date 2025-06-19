import instance from "../services/axiosConfig";
import Cookies from "js-cookie";

export const getAllOrders = async (
  page = 1,
  limit = 10,
  search,
  status,
  paymentMethod,
  paymentStatus
) => {
  try {
    const params = new URLSearchParams();

    // Add pagination parameters
    params.append("page", page);
    params.append("limit", limit);

    // Add search parameter
    if (search) {
      params.append("search", search);
    }

    // Add status filter (this maps to the backend's status parameter)
    if (status && status !== "All") {
      params.append("status", status);
    }

    // Add payment method filter
    if (paymentMethod && paymentMethod !== "All") {
      params.append("paymentMethod", paymentMethod);
    }

    // Add payment status filter
    if (paymentStatus && paymentStatus !== "All") {
      params.append("paymentStatus", paymentStatus);
    }

    const response = await instance.get(`/order?${params.toString()}`, {
      requiresAuth: true,
    });
    return {
      data: response.data.data,
      meta: response.data.meta,
    };
  } catch (error) {
    throw error;
  }
};

export const getOrderById = async (id) => {
  try {
    const response = await instance.get(`/order/${id}`, { requiresAuth: true });
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

export const getOrderByUserId = async (userId) => {
  try {
    const response = await instance.get(
      "/order/get/userId?limit=1000",
      {
        userId: userId,
      },
      { requiresAuth: true }
    );
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

export const createOrder = async (
  orderItems,
  discount,
  userAddressId,
  shippingFee,
  paymentMethod,
  deliveryInfo,
  expectedDeliveryDate
) => {
  try {
    const response = await instance.post(
      "/order",
      {
        orderItems,
        discount,
        userAddressId,
        shippingFee,
        paymentMethod,
        deliveryInfo,
        expectedDeliveryDate,
      },
      { requiresAuth: true }
    );
    return response.data.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const updateDeliveryInfoById = async (
  orderId,
  status,
  deliveryAddress,
  expectedDeliveryDate
) => {
  try {
    const response = await instance.put(
      `/order/deliveryInfo/${orderId}`,
      {
        status,
        deliveryAddress,
        expectedDeliveryDate,
      },
      { requiresAuth: true }
    );
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

export const updatePaymentStatusById = async (orderId, paymentStatus) => {
  try {
    const response = await instance.put(
      `/order/paymentStatus/${orderId}`,
      {
        paymentStatus,
      },
      { requiresAuth: true }
    );
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

export const sendMailDeliveryInfo = async (orderId, email) => {
  try {
    const response = await instance.post(
      `/order/sendDeliveryInfo`,
      {
        orderId,
        email,
      },
      { requiresAuth: false }
    );
    return response.data.data;
  } catch (error) {
    throw error;
  }
};
