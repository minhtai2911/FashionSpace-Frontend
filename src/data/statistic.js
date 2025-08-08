import instance from "../services/axiosConfig";
import Cookies from "js-cookie";

export const getStatistics = async (day, month, year) => {
  try {
    const params = new URLSearchParams();

    if (day) {
      params.append("day", day);
    }

    if (month) {
      params.append("month", month);
    }

    if (year) {
      params.append("year", year);
    }

    const response = await instance.get(`/statistic?${params.toString()}`, {
      requireAuth: true,
    });
    return response.data.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getStatisticsOverview = async () => {
  try {
    const response = await instance.get("/statistic/overview", {
      requireAuth: true,
    });
    return response.data.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
