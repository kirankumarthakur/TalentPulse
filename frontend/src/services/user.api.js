import api from "../utils/axios";

export const getCurrentUser = async () => {
  try {
    const res = await api.get("/api/me");
    return res.data;
  } catch (error) {
    console.error("Error fetching current user:", error);
    return null;
  }
};

export const useCredits = async (data) => {
  try {
    const res = await api.post("/api/auth/usecredits", data);
    return res.data;
  } catch (error) {
    console.error("Error using credits:", error);
    throw error;
  }
};
