import instance from "../services/axiosConfig";

export const getAllCategories = async (
  page = 1,
  limit = 10,
  search,
  isActive,
  gender
) => {
  try {
    const params = new URLSearchParams();

    params.append("page", page);
    params.append("limit", limit);

    if (search) {
      params.append("search", search);
    }

    if (isActive !== undefined && isActive !== null) {
      params.append("isActive", isActive);
    }

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
  try {
    const response = await instance.post(
      "/category",
      { name: category, gender: gender },
      { requiresAuth: true }
    );
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

export const updateCategory = async (id, name, gender) => {
  try {
    const response = await instance.put(
      `/category/${id}`,
      { name: name, gender: gender },
      { requiresAuth: true }
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
