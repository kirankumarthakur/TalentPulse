import api from "../utils/axios";

export const startInterview = async (interviewData) => {
  try {
    const response = await api.post("/api/interview/start", interviewData);
    console.log("Interview started successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error starting interview:", error);
    return null;
  }
};

export const getInterviewSession = async (interviewId) => {
  try {
    const response = await api.get(`/api/interview/${interviewId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching interview session:", error);
    return null;
  }
};

export const getInterviewHistory = async () => {
  try {
    const response = await api.get("/api/interview/history");
    const data = response.data;
    return {
      ...data,
      interviews: (data?.interviews || []).map((interview) => ({
        id: interview.interviewId,
        role: interview.interviewRole,
        interviewType: interview.interviewType,
        score: Number(interview.finalScore) || 0,
        status: interview.status,
        questionsAnswered: interview.questionsAnswered || 0,
        completedAt: interview.completedAt || interview.createdAt,
      })),
    };
  } catch (error) {
    console.error("Error fetching interview history:", error);
    return null;
  }
};

export const submitInterviewAnswer = async (interviewId, answer) => {
  try {
    const response = await api.post("/api/interview/submit-answer", {
      interviewId,
      answer,
    });
    console.log("Interview answer submitted:", response.data);
    if (response.data?.feedback) {
      console.log("Question Feedback:", response.data.feedback);
    }
    return response.data;
  } catch (error) {
    console.error("Error submitting interview answer:", error);
    return null;
  }
};

export const getAllInterviews = async () => {
  try {
    const response = await api.get("/api/interview/all");
    return response.data;
  } catch (error) {
    console.error("Error fetching all interviews:", error);
    return null;
  }
};
