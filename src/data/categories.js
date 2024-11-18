import instance from "../services/axiosConfig";
import Cookies from "js-cookie";

export const getAllCategories = async () => {
  try {
    const response = await instance.get("/category");
    return response.data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getCategoryById = async (categoryId) => {
  try {
    const response = await instance.get(`/category/${categoryId}`);
    return response.data;
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
    return response.data;
  } catch (error) {
    return null;
  }
};
