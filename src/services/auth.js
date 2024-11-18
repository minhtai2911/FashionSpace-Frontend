import instance from "./axiosConfig";

export const login = async (body) => {
  return await instance.post("/auth/login", body);
};
