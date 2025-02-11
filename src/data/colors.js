import instance from "../services/axiosConfig";
import Cookies from "js-cookie";

export const getAllColors = async () => {
  try {
    const response = await instance.get("/productColor");
    return response.data.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getColorById = async (id) => {
  try {
    const response = await instance.get(`/productColor/${id}`);
    return response.data.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const createColor = async (color) => {
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
      "/productColor",
      { color: color },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

export const updateColor = async (id, color) => {
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
      `/productColor/${id}`,
      { color: color },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

export const deleteColorById = async (id) => {
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
    const response = await instance.delete(`/productColor/${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data.data;
  } catch (error) {
    throw error;
  }
};
