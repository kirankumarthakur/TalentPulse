import React from "react";
import { motion } from "motion/react";

const formatTime = (seconds) =>
  `${Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0")}:${(seconds % 60).toString().padStart(2, "0")}`;

const InterviewHeader = ({ seconds, isDictating, submitting, feedbackInfo }) => {
  const isFeedback = Boolean(feedbackInfo);

  return (
    <motion.header
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-[#c4d4eb] pb-5"
    >
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#e63946]">
          Live interview
        </p>
        <p className="mt-2 text-sm font-semibold text-[#457b9d]">
          {isFeedback
            ? "Interviewer is providing feedback..."
            : submitting
            ? "Submitting your answer..."
            : isDictating
            ? "Interviewer is dictating... (timer starts when ready or when you begin answering)"
            : "Your turn to answer"}
        </p>
      </div>

      <motion.div
        animate={{
          scale:
            seconds < 15 && !isDictating && !isFeedback && !submitting
              ? [1, 1.04, 1]
              : 1,
        }}
        transition={{
          duration: 0.5,
          repeat:
            seconds < 15 && !isDictating && !isFeedback && !submitting
              ? Infinity
              : 0,
        }}
        className={`border-2 px-4 py-2 text-lg font-black transition-colors ${
          isFeedback
            ? "border-[#1d3557] bg-[#f1faee] text-[#1d3557]"
            : submitting
            ? "border-[#e63946] bg-[#fad7da] text-[#e63946]"
            : seconds < 15 && !isDictating
            ? "border-[#e63946] text-[#e63946]"
            : "border-[#1d3557] text-[#1d3557]"
        }`}
      >
        {isFeedback
          ? "FEEDBACK"
          : submitting
          ? "SUBMITTING"
          : formatTime(seconds)}
      </motion.div>
    </motion.header>
  );
};

export default InterviewHeader;
