import api from "../utils/axios";

export const getBillingPlans = async () => {
  try {
    const response = await api.get("/api/billing/plans");
    return response.data;
  } catch (error) {
    console.error("Error fetching billing plans:", error);
    return null;
  }
};
