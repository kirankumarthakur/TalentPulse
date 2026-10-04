import { END, START, StateGraph } from "@langchain/langgraph";
import InterviewState from "./state.js";
import { interviewNode, feedbackNode, scoreNode } from "./nodes.js";

const router = (state) => {
  switch (state.action) {
    case "start":
      return "interviewAgent";
    case "feedback":
      return "feedbackAgent";

    default:
      return END;
  }
};

const feedbackRouter = (state) => {
  if (state.completed) {
    return "scoreAgent";
  }

  return END;
};

const graph = new StateGraph(InterviewState)
  .addNode("interviewAgent", interviewNode)
  .addNode("feedbackAgent", feedbackNode)
  .addNode("scoreAgent", scoreNode)
  .addConditionalEdges(START, router, {
    interviewAgent: "interviewAgent",
    feedbackAgent: "feedbackAgent",
    [END]: END,
  })
  .addEdge("interviewAgent", END)
  .addConditionalEdges("feedbackAgent", feedbackRouter, {
    scoreAgent: "scoreAgent",
    [END]: END,
  })
  .addEdge("scoreAgent", END)
  .compile();

export default graph;
