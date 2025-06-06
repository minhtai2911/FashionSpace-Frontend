import instance from "../services/axiosConfig";

export const getAllUserRoles = async () => {
  try {
    const response = await instance.get("/userRole", { requiresAuth: true });
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

export const getUserRoleById = async (id) => {
  try {
    const response = await instance.get(`/userRole/${id}`, {
      requiresAuth: true,
    });
    return response.data.data;
  } catch (error) {
    throw error;
  }
};
