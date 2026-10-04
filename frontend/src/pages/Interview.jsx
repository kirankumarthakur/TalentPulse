import React from "react";
import { getInterviewSession } from "../services/interview.api";
import InterviewSession from "../components/interview/InterviewSession";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const Interview = ({ user, setUser }) => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [interview, setInterview] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInterview = async () => {
      const response = await getInterviewSession(id);
      const data = response?.interviewSession;
      if (!data) {
        setLoading(false);
        return;
      }
      if (data.status === "completed") {
        navigate(`/dashboard/interview/${id}/report`, { replace: true });
        return;
      }
      setInterview(data);
      setLoading(false);
    };

    fetchInterview();
  }, [id, navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <InterviewSession
      interviewData={{
        interviewId: interview._id,
        currentQuestionIndex: interview.currentQuestionIndex,
        totalQuestions: interview.questionBank.length,
        questionBank: interview.questionBank,
      }}
      user={user}
      setUser={setUser}
    />
  );
};

export default Interview;
