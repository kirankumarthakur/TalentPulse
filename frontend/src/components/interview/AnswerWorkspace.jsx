import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { FiCode, FiMic, FiPlay, FiSend, FiArrowRight } from "react-icons/fi";

const SUPPORTED_LANGUAGES = [
  { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
  { value: "python", label: "Python" },
  { value: "java", label: "Java" },
  { value: "cpp", label: "C++" },
];

const TranscriptEditor = ({ value, onChange }) => {
  return (
    <textarea
      className="h-[260px] w-full resize-none border-2 border-[#89aad8] p-4 font-sans text-base leading-relaxed text-[#1d3557] outline-none transition-colors placeholder:text-[#89aad8] focus:border-[#1d3557]"
      placeholder="Speak your answer using the microphone or type your notes here. You can edit anytime."
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
};

const CodeEditor = ({ language, code, onLanguageChange, onCodeChange }) => {
  return (
    <div className="overflow-hidden border-2 border-[#89aad8]">
      <div className="flex items-center justify-between border-b border-[#89aad8] bg-[#f1faee] px-4 py-2">
        <label
          htmlFor="code-language"
          className="text-xs font-bold uppercase tracking-wider text-[#457b9d]"
        >
          Language
        </label>
        <select
          id="code-language"
          value={language}
          onChange={(e) => onLanguageChange(e.target.value)}
          className="border border-[#89aad8] bg-white px-3 py-1 text-sm font-semibold text-[#1d3557] outline-none transition-colors focus:border-[#1d3557]"
        >
          {SUPPORTED_LANGUAGES.map((lang) => (
            <option key={lang.value} value={lang.value}>
              {lang.label}
            </option>
          ))}
        </select>
      </div>

      <textarea
        className="h-[220px] w-full resize-none bg-[#1e1e1e] p-4 font-mono text-sm leading-relaxed text-[#f1faee] outline-none placeholder:text-gray-500 focus:ring-1 focus:ring-[#89aad8]"
        placeholder={`// Write your ${language} solution here...`}
        value={code || ""}
        onChange={(e) => onCodeChange(e.target.value)}
        spellCheck={false}
      />
    </div>
  );
};

const AnswerWorkspace = ({
  question,
  mode,
  transcript,
  code,
  language,
  onModeChange,
  onTranscriptChange,
  onCodeChange,
  onLanguageChange,
  onSubmit,
  onStartAnswering,
  onNextQuestion,
  isDictating,
  submitting,
  isFirstQuestion,
  feedbackInfo,
  feedbackCompleted,
}) => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="flex flex-col justify-between border-2 border-[#1d3557] bg-white p-6 sm:p-8 shadow-[6px_6px_0_#1d3557]"
    >
      <div>
        {/* Dictation Banner: Informs candidate that timer begins when dictated or when answering begins */}
        <AnimatePresence>
          {isDictating && !feedbackInfo && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-l-4 border-[#1d3557] bg-[#f1faee] p-4 text-xs leading-5 text-[#37627d]"
            >
              <div>
                <span className="font-bold text-[#1d3557]">
                  👋 {isFirstQuestion ? "Welcome!" : "Interviewer speaking"}
                </span>{" "}
                Listen as your interviewer dictates your question. Your timer
                will begin as soon as the question is dictated or you start
                answering.
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={onStartAnswering}
                className="inline-flex shrink-0 items-center justify-center gap-1.5 border-2 border-[#1d3557] bg-[#1d3557] px-3.5 py-1.5 text-xs font-bold text-[#f1faee] hover:bg-[#e63946] hover:border-[#e63946] transition-colors"
              >
                <FiPlay size={12} /> Start Answering Now
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Feedback Display Card */}
        <AnimatePresence>
          {feedbackInfo && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-5 border-2 border-[#1d3557] bg-[#f1faee] p-5 shadow-[4px_4px_0_#1d3557]"
            >
              <div className="flex items-center justify-between border-b border-[#c4d4eb] pb-3">
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center bg-[#1d3557] text-xs font-bold text-[#f1faee]">
                    AI
                  </span>
                  <p className="text-xs font-bold uppercase tracking-wider text-[#1d3557]">
                    Interviewer Feedback
                  </p>
                </div>
                {typeof feedbackInfo.score === "number" && (
                  <span className="border border-[#1d3557] bg-white px-3 py-0.5 text-xs font-black text-[#1d3557]">
                    Score: {feedbackInfo.score} / 100
                  </span>
                )}
              </div>

              <p className="mt-3 font-sans text-base leading-relaxed text-[#1d3557]">
                {typeof feedbackInfo === "string"
                  ? feedbackInfo
                  : feedbackInfo.feedback || "Answer recorded successfully."}
              </p>

              {Array.isArray(feedbackInfo.suggestions) &&
                feedbackInfo.suggestions.length > 0 && (
                  <div className="mt-3 border-t border-[#c4d4eb] pt-3">
                    <p className="text-xs font-bold uppercase tracking-wider text-[#457b9d]">
                      Key suggestions:
                    </p>
                    <ul className="mt-1.5 list-inside list-disc space-y-1 text-xs text-[#37627d]">
                      {feedbackInfo.suggestions.map((suggestion, idx) => (
                        <li key={idx}>{suggestion}</li>
                      ))}
                    </ul>
                  </div>
                )}

              <div className="mt-4 flex items-center justify-between border-t border-[#c4d4eb] pt-3 text-xs text-[#457b9d]">
                <span className="flex items-center gap-2 font-medium">
                  <span className="inline-block h-2 w-2 animate-ping rounded-full bg-[#e63946]" />
                  Feedback ready
                </span>
                {onNextQuestion && (
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    type="button"
                    onClick={onNextQuestion}
                    className="inline-flex items-center gap-1.5 font-bold text-[#1d3557] underline hover:text-[#e63946]"
                  >
                    {feedbackCompleted ? "View Final Report" : "Continue to Next"} &rarr;
                  </motion.button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Question Header */}
        <div className="border-b border-[#c4d4eb] pb-4">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#e63946]">
            Current Question
          </p>
          <h2 className="mt-2 text-lg font-bold leading-relaxed text-[#1d3557]">
            {question}
          </h2>
        </div>

        {/* Workspace Mode Tabs */}
        <div className="mt-5">
          <div className="flex items-center justify-between border-b border-[#c4d4eb]">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => onModeChange("notes")}
                className={`flex items-center gap-2 border-b-2 px-4 py-2 text-sm font-bold transition-all ${
                  mode === "notes"
                    ? "border-[#e63946] text-[#1d3557]"
                    : "border-transparent text-[#457b9d] hover:text-[#1d3557]"
                }`}
              >
                <FiMic className="text-base" /> Transcript
              </button>
              <button
                type="button"
                onClick={() => onModeChange("code")}
                className={`flex items-center gap-2 border-b-2 px-4 py-2 text-sm font-bold transition-all ${
                  mode === "code"
                    ? "border-[#e63946] text-[#1d3557]"
                    : "border-transparent text-[#457b9d] hover:text-[#1d3557]"
                }`}
              >
                <FiCode className="text-base" /> Code
              </button>
            </div>

            <span className="hidden text-xs font-semibold text-[#457b9d] sm:inline-block">
              {mode === "code" ? "Coding mode" : "Spoken answer"}
            </span>
          </div>

          {/* Active Input Area */}
          <div className="mt-4">
            {mode === "notes" ? (
              <TranscriptEditor
                value={transcript}
                onChange={onTranscriptChange}
              />
            ) : (
              <CodeEditor
                code={code}
                language={language}
                onCodeChange={onCodeChange}
                onLanguageChange={onLanguageChange}
              />
            )}
          </div>
        </div>
      </div>

      {/* Footer / Submit Area */}
      <div className="mt-6 flex flex-col gap-4 border-t border-[#c4d4eb] pt-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-[#457b9d]">
          {feedbackInfo
            ? "Review the feedback above and click continue when you are ready."
            : "Your answer will automatically be submitted when the timer expires."}
        </p>

        {feedbackInfo ? (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={onNextQuestion}
            className="flex items-center justify-center gap-2 border-2 border-[#1d3557] bg-[#1d3557] px-6 py-2.5 text-sm font-bold text-[#f1faee] transition-all hover:bg-[#e63946] hover:border-[#e63946]"
          >
            <span>
              {feedbackCompleted
                ? "View Final Report"
                : "Continue to Next Question"}
            </span>
            <FiArrowRight />
          </motion.button>
        ) : isDictating ? (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={onStartAnswering}
            className="flex items-center justify-center gap-2 border-2 border-[#1d3557] bg-[#1d3557] px-6 py-2.5 text-sm font-bold text-[#f1faee] transition-all hover:bg-[#e63946] hover:border-[#e63946]"
          >
            <FiPlay />
            <span>Start Answering Now</span>
          </motion.button>
        ) : (
          <motion.button
            whileHover={{ scale: submitting ? 1 : 1.02 }}
            whileTap={{ scale: submitting ? 1 : 0.98 }}
            type="button"
            disabled={submitting}
            onClick={onSubmit}
            className="flex items-center justify-center gap-2 border-2 border-[#1d3557] bg-[#1d3557] px-6 py-2.5 text-sm font-bold text-[#f1faee] transition-all hover:bg-white hover:text-[#1d3557] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FiSend />
            <span>{submitting ? "Submitting answer..." : "Submit Answer"}</span>
          </motion.button>
        )}
      </div>
    </motion.section>
  );
};

export default AnswerWorkspace;
