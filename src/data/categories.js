import instance from "../services/axiosConfig";
import Cookies from "js-cookie";

export const getAllCategories = async () => {
  try {
    const response = await instance.get("/category");
    return response.data.data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getCategoryById = async (id) => {
  try {
    const response = await instance.get(`/category/${id}`);
    return response.data.data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const createCategory = async (category, gender) => {
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
      "/category",
      { name: category, gender: gender },
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

export const updateCategory = async (id, name, gender) => {
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
      `/category/${id}`,
      { name: name, gender: gender },
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

export const deleteCategoryById = async (id) => {
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
    const response = await instance.delete(`/category/${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data.data;
  } catch (error) {
    return null;
  }
};
