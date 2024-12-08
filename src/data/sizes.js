import instance from "../services/axiosConfig";
import Cookies from "js-cookie";

export const getAllSizes = async () => {
  try {
    const response = await instance.get("/productSize");
    return response.data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getSizeById = async (id) => {
  try {
    const response = await instance.get(`/productSize/${id}`);
    return response.data;
  } catch (error) {
    return null;
  }
};

export const getSizesByCategory = async (categoryId) => {
  try {
    const response = await instance.get(
      `/productSize/categoryId/${categoryId}`
    );
    return response.data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const createSize = async (categoryId, size) => {
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
      "/productSize",
      { categoryId: categoryId, size: size },
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

export const updateSize = async (id, categoryId, size) => {
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
      `/productSize/${id}`,
      {
        categoryId: categoryId,
        size: size,
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
    return false;
  }
};

export const deleteSizeById = async (id) => {
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
    const response = await instance.delete(`/productSize/${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.log(error);
    return false;
  }
};
