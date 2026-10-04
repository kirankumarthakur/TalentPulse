import { interviewAgent } from "../agents/interview.agent.js";
import { feedbackAgent } from "../agents/feedback.agent.js";
import { scoreAgent } from "../agents/score.agent.js";

export async function interviewNode(state) {
  const questions = await interviewAgent({
    role: state.interviewRole,
    interviewType: state.interviewType,
    withResume: state.withResume,
    resume: state.resume,
  });

  return { questions };
}

export async function feedbackNode(state) {
  const feedback = await feedbackAgent({
    question: state.currentQuestion,
    answer: state.currentAnswer,
    difficulty: state.difficultyRating,
  });

  const updatedQuestionBank = (state.questionBank || []).map((q) => {
    if (q.questionDescription === state.currentQuestion) {
      return {
        ...q,
        userAnswer: state.currentAnswer,
        feedback,
      };
    }
    return q;
  });

  return {
    feedback,
    questionBank: updatedQuestionBank,
  };
}

export async function scoreNode(state) {
  return scoreAgent({
    role: state.interviewRole,
    interviewType: state.interviewType,
    questions: state.questionBank,
  });
}
