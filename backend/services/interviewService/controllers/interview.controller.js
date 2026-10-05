import redisClient from "../configs/redisConfig.js";
import graph from "../graph/graph.js";
import Interview from "../models/interview.model.js";

export const startInterviewNode = async (req, res) => {
  try {
    const userId = req.headers["x-user-id"];
    if (!userId) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No user ID provided" });
    }

    const { interviewType, role, withResume = false, resume = {} } = req.body;

    if (!interviewType || !role) {
      return res.status(400).json({
        success: false,
        message: "Bad Request: Missing required fields",
      });
    }

    const result = await graph.invoke({
      action: "start",
      interviewRole: role,
      interviewType,
      withResume,
      resume,
    });

    const questions = result.questions;
    if (!questions || questions.length === 0) {
      return res.status(500).json({
        success: false,
        message: "Internal Server Error: No questions generated",
      });
    }

    const interviewSession = await Interview.create({
      userId,
      interviewType,
      interviewRole: role,
      withResume,
      questionBank: questions,
      currentQuestionIndex: 0,
      status: "inProgress",
    });

    try {
      await redisClient.del(`interviews:${userId}`);
    } catch (cacheError) {
      console.warn("Failed to invalidate Redis cache:", cacheError.message);
    }

    return res.status(200).json({
      success: true,
      message: "Interview started successfully",
      interviewId: interviewSession._id,
      currentQuestion: 0,
      totalQuestions: interviewSession.questionBank.length,
      question: interviewSession.questionBank[0],
    });
  } catch (error) {
    console.error("Error starting interview:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error: Failed to start interview",
    });
  }
};

export const submitAnswerNode = async (req, res) => {
  try {
    const userId = req.headers["x-user-id"];
    if (!userId) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No user ID provided" });
    }

    const { interviewId, answer } = req.body;
    if (!interviewId || !answer) {
      return res.status(400).json({
        success: false,
        message: "Bad Request: Missing required fields",
      });
    }

    const interviewSession = await Interview.findOne({
      _id: interviewId,
      userId,
    });

    if (!interviewSession) {
      return res.status(404).json({
        success: false,
        message: "Not Found: Interview session not found",
      });
    }

    if (interviewSession.status === "completed") {
      return res.status(400).json({
        success: false,
        message: "Bad Request: Interview session already completed",
      });
    }

    const idx = interviewSession.currentQuestionIndex;
    const currentQuestion = interviewSession.questionBank[idx];
    if (!currentQuestion) {
      return res.status(400).json({
        success: false,
        message: "Bad Request: No current question found",
      });
    }

    currentQuestion.userAnswer = answer;
    const completed = idx + 1 >= interviewSession.questionBank.length;

    const result = await graph.invoke({
      action: "feedback",
      currentQuestion: currentQuestion.questionDescription,
      currentAnswer: answer,
      difficultyRating: currentQuestion.difficultyRating,
      completed,
      interviewRole: interviewSession.interviewRole,
      interviewType: interviewSession.interviewType,
      questionBank: interviewSession.questionBank,
    });

    currentQuestion.feedback = result.feedback;

    if (completed) {
      interviewSession.status = "completed";
      interviewSession.completedAt = new Date();
      interviewSession.finalScore = result.finalScore || 0;
      interviewSession.strengths = result.strengths || [];
      interviewSession.weaknesses = result.weaknesses || [];
      interviewSession.keyMissingPoints = result.keyMissingPoints || [];
      interviewSession.recommendations = result.recommendations || [];
      interviewSession.summary = result.summary || "";
    } else {
      interviewSession.currentQuestionIndex += 1;
    }

    interviewSession.markModified("questionBank");
    await interviewSession.save();

    try {
      await redisClient.del(`interviews:${userId}`);
    } catch (cacheError) {
      console.warn("Failed to invalidate Redis cache:", cacheError.message);
    }

    if (completed) {
      return res.status(200).json({
        success: true,
        completed: true,
        interviewSession,
      });
    }

    return res.status(200).json({
      success: true,
      completed: false,
      currentQuestion:
        interviewSession.questionBank[interviewSession.currentQuestionIndex],
      feedback: result.feedback,
    });
  } catch (error) {
    console.error("Error submitting answer:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error: Failed to submit answer",
    });
  }
};

export const getInterviewSession = async (req, res) => {
  try {
    const userId = req.headers["x-user-id"];
    if (!userId) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No user ID provided" });
    }

    const { interviewId } = req.params;
    if (!interviewId) {
      return res.status(400).json({
        success: false,
        message: "Bad Request: Missing interview ID",
      });
    }

    const interviewSession = await Interview.findById({
      _id: interviewId,
      userId,
    });
    if (!interviewSession) {
      return res.status(404).json({
        success: false,
        message: "Not Found: Interview session not found",
      });
    }

    return res.status(200).json({
      success: true,
      interviewSession,
    });
  } catch (error) {
    console.error("Error fetching interview session:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error: Failed to fetch interview session",
    });
  }
};

export const getAllInterviews = async (req, res) => {
  try {
    const userId = req.headers["x-user-id"];
    if (!userId) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No user ID provided" });
    }

    const cache = await redisClient.get(`interviews:${userId}`);
    if (cache) {
      const parsed = JSON.parse(cache);
      const hasNonCompleted = (parsed.interviews || []).some(
        (interview) => interview.status !== "completed",
      );
      if (!hasNonCompleted) {
        return res.status(200).json({
          success: true,
          source: "redis",
          ...parsed,
        });
      }
    }

    const interviews = await Interview.find({
      userId,
      status: "completed",
    }).sort({ createdAt: -1 });

    const calculateSkillAverages = (interviewList) => {
      const totals = {
        correctness: 0,
        clarity: 0,
        communication: 0,
        relevance: 0,
        detail: 0,
        efficiency: 0,
        problemSolving: 0,
        creativity: 0,
        criticalThinking: 0,
      };
      let totalQuestions = 0;

      for (const interview of interviewList) {
        for (const question of interview.questionBank || []) {
          const feedback = question.feedback;
          if (!feedback) continue;

          totals.correctness += feedback.correctness || 0;
          totals.clarity += feedback.clarity || 0;
          totals.communication += feedback.communication || 0;
          totals.relevance += feedback.relevance || 0;
          totals.detail += feedback.detail || 0;
          totals.efficiency += feedback.efficiency || 0;
          totals.problemSolving += feedback.problemSolving || 0;
          totals.creativity += feedback.creativity || 0;
          totals.criticalThinking += feedback.criticalThinking || 0;
          totalQuestions += 1;
        }
      }

      const getAverage = (sum) =>
        totalQuestions > 0 ? Math.round(sum / totalQuestions) : 0;

      return [
        { skill: "Correctness", score: getAverage(totals.correctness) },
        { skill: "Clarity", score: getAverage(totals.clarity) },
        { skill: "Communication", score: getAverage(totals.communication) },
        { skill: "Relevance", score: getAverage(totals.relevance) },
        { skill: "Detail", score: getAverage(totals.detail) },
        { skill: "Efficiency", score: getAverage(totals.efficiency) },
        { skill: "Problem Solving", score: getAverage(totals.problemSolving) },
        { skill: "Creativity", score: getAverage(totals.creativity) },
        {
          skill: "Critical Thinking",
          score: getAverage(totals.criticalThinking),
        },
      ];
    };

    const calculateSummaryStats = (interviewList) => {
      const totalQuestions = interviewList.reduce(
        (sum, interview) => sum + (interview.questionBank?.length || 0),
        0,
      );
      const averageScore =
        interviewList.length > 0
          ? Math.round(
              interviewList.reduce(
                (sum, interview) => sum + (interview.finalScore || 0),
                0,
              ) / interviewList.length,
            )
          : 0;

      return {
        totalInterviews: interviewList.length,
        completedInterviews: interviewList.length,
        totalQuestions,
        averageScore,
      };
    };

    const technicalInterviews = interviews.filter(
      (interview) => interview.interviewType === "technical",
    );
    const behavioralInterviews = interviews.filter(
      (interview) => interview.interviewType === "behavioral",
    );

    const technicalData = {
      stats: calculateSummaryStats(technicalInterviews),
      radarData: calculateSkillAverages(technicalInterviews),
    };

    const behavioralData = {
      stats: calculateSummaryStats(behavioralInterviews),
      radarData: calculateSkillAverages(behavioralInterviews),
    };

    const bothData = {
      stats: calculateSummaryStats(interviews),
      radarData: calculateSkillAverages(interviews),
    };

    const payload = {
      technical: technicalData,
      behavioral: behavioralData,
      both: bothData,
      interviews,
      stats: bothData.stats,
      radarData: bothData.radarData,
    };

    try {
      await redisClient.setex(
        `interviews:${userId}`,
        3600,
        JSON.stringify(payload),
      );
    } catch (cacheError) {
      console.warn("Redis caching warning:", cacheError.message);
    }

    return res.status(200).json({
      success: true,
      source: "mongodb",
      ...payload,
    });
  } catch (error) {
    console.error("Error fetching all interviews:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error: Failed to fetch all interviews",
    });
  }
};

export const getInterviewHistory = async (req, res) => {
  try {
    const userId = req.headers["x-user-id"];
    if (!userId) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No user ID provided" });
    }

    const interviews = await Interview.find(
      { userId, status: "completed" },
      {
        interviewType: 1,
        interviewRole: 1,
        finalScore: 1,
        status: 1,
        createdAt: 1,
        completedAt: 1,
        updatedAt: 1,
        questionBank: 1,
      },
    )
      .sort({ createdAt: -1 })
      .lean();

    const totalScore = interviews.reduce(
      (sum, interview) => sum + (Number(interview.finalScore) || 0),
      0,
    );

    return res.status(200).json({
      success: true,
      totalCount: interviews.length,
      averageScore: interviews.length ? totalScore / interviews.length : 0,
      interviews: interviews.map((interview) => ({
        id: interview._id,
        interviewId: interview._id,
        questionsAnswered: (interview.questionBank || []).filter(
          (question) => question.userAnswer,
        ).length,
        interviewType: interview.interviewType,
        interviewRole: interview.interviewRole,
        role: interview.interviewRole,
        finalScore: interview.finalScore,
        score: interview.finalScore,
        status: interview.status,
        createdAt: interview.createdAt,
        completedAt: interview.completedAt || interview.updatedAt,
      })),
    });
  } catch (error) {
    console.error("Error fetching interview history:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error: Failed to fetch interview history",
    });
  }
};
