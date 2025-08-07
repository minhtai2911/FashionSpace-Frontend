import instance from "../services/axiosConfig";
import Cookies from "js-cookie";

export const getAllUsers = async (
  page = 1,
  limit = 10,
  search,
  isActive,
  roleName
) => {
  try {
    const params = new URLSearchParams();

    // Add pagination parameters
    params.append("page", page);
    params.append("limit", limit);

    // Add filter parameters
    if (search) {
      params.append("search", search);
    }

    if (isActive !== undefined && isActive !== null) {
      params.append("isActive", isActive);
    }

    if (roleName && roleName !== "All") {
      params.append("roleName", roleName);
    }

    const response = await instance.get(`/user?${params.toString()}`, {
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

export const getUserById = async (id) => {
  try {
    const response = await instance.get(`/user/${id}`, { requiresAuth: false });
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

export const createUser = async (email, fullName, phone, password, roleId) => {
  try {
    const response = await instance.post(
      "/user",
      {
        email,
        fullName,
        phone,
        password,
        roleId,
      },
      { requiresAuth: true }
    );
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

export const updateUserById = async (id, fullName, phone, roleId) => {
  try {
    const response = await instance.put(
      `/user/${id}`,
      {
        fullName: fullName,
        phone: phone,
        roleId: roleId,
      },
      { requiresAuth: true }
    );
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

export const archiveUserById = async (id) => {
  try {
    const response = await instance.put(`/user/archive/${id}`, {
      requiresAuth: true,
    });
    return response.data.data;
  } catch (error) {
    throw error;
  }
};
