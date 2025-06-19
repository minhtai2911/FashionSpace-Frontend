import instance from "../services/axiosConfig";
import Cookies from "js-cookie";

export const getAllCategories = async (
  page = 1,
  limit = 10,
  search,
  isActive,
  gender
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

    // Add isActive filter
    if (isActive !== undefined && isActive !== null) {
      params.append("isActive", isActive);
    }

    // Add gender filter
    if (gender) {
      params.append("gender", gender);
    }

    const response = await instance.get(`/category?${params.toString()}`, {
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

export const getCategoryById = async (id) => {
  try {
    const response = await instance.get(`/category/${id}`, {
      requiresAuth: false,
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const createCategory = async (category, gender) => {
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
      "/category",
      { name: category, gender: gender },
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

export const updateCategory = async (id, name, gender) => {
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
      `/category/${id}`,
      { name: name, gender: gender },
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

export const updateStatusCategoryById = async (id) => {
  try {
    const response = await instance.put(`/category/archive/${id}`, {
      requiresAuth: true,
    });
    return response.data.data;
  } catch (error) {
    throw error;
  }
};
