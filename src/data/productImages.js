import instance from "../services/axiosConfig";
import Cookies from "js-cookie";

export const getAllImagesByProductId = async (productId) => {
  try {
    const response = await instance.get(`/productImage/productId/${productId}`);
    return response.data;
  } catch (error) {
    return null;
  }
};

export const createProductImage = async (productId, images) => {
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
    const formData = new FormData();
    formData.append("productId", productId);

    images.forEach((image) => {
      if (image.imageFile) {
        formData.append("imagePath", image.imageFile);
      }
    });

    const response = await instance.post(`/productImage`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const updateProductImageById = async (id, productId, image) => {
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
    const formData = new FormData();
    formData.append("productId", productId);

    if (image.imageFile) {
      formData.append("imagePath", image.imageFile);
    }

    const response = await instance.put(`/productImage/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const deleteProductImageById = async (id) => {
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
    const response = await instance.delete(`/productImage/${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const deleteProductImagesByProductId = async (productId) => {
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
    const response = await instance.delete(
      `/productImage/productId/${productId}`,
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
