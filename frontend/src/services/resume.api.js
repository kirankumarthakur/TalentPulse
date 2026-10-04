import api from "../utils/axios";

export const getResume = async () => {
    try {
        const res = await api.get("/api/resume/download");
        return res.data;
    } catch (error) {
        console.error("Error fetching resume:", error);
        return null;
    }
}