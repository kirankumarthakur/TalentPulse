import { Annotation } from "@langchain/langgraph";

const InterviewState = Annotation.Root({
  action: Annotation(),
  interviewType: Annotation(),
  interviewRole: Annotation(),
  withResume: Annotation(),
  resume: Annotation(),
  questions: Annotation(),
  questionBank: Annotation(),
  currentQuestion: Annotation(),
  currentQuestionIndex: Annotation(),
  currentAnswer: Annotation(),
  difficultyRating: Annotation(),
  feedback: Annotation(),
  report: Annotation(),
  score: Annotation(),
  finalScore: Annotation(),
  strengths: Annotation(),
  weaknesses: Annotation(),
  keyMissingPoints: Annotation(),
  recommendations: Annotation(),
  summary: Annotation(),
  completed: Annotation(),
});

export default InterviewState;
