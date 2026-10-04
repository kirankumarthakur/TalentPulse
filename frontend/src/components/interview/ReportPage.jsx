import { useEffect, useMemo, useState } from "react";
import { FiArrowLeft, FiCheck, FiChevronDown, FiClock, FiTarget, FiTrendingUp } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import { getInterviewSession } from "../../services/interview.api";

const ListCard = ({ items, title, tone }) => (
  <section className="border-2 border-[#c4d4eb] bg-white p-6">
    <h2 className="text-lg font-black text-[#1d3557]">{title}</h2>
    <ul className="mt-4 space-y-3">
      {items.length > 0 ? (
        items.map((item, index) => (
          <li className="flex gap-3 text-sm leading-6 text-[#37627d]" key={`${item}-${index}`}>
            <span className={`mt-1 flex h-5 w-5 shrink-0 items-center justify-center ${tone}`}>
              <FiCheck size={13} />
            </span>
            <span>{item}</span>
          </li>
        ))
      ) : (
        <li className="text-sm text-[#6097b9]">No points were recorded for this section.</li>
      )}
    </ul>
  </section>
);

const QuestionReview = ({ question, index }) => {
  const [open, setOpen] = useState(false);
  const feedback = question.feedback || {};
  const score = Number.isFinite(feedback.score) ? feedback.score : 0;

  return (
    <article className="border-2 border-[#c4d4eb] bg-white">
      <button
        className="flex w-full items-center justify-between gap-4 p-5 text-left"
        onClick={() => setOpen((value) => !value)}
        type="button"
      >
        <div className="flex min-w-0 items-center gap-4">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center bg-[#1d3557] text-sm font-black text-[#f1faee]">
            {index + 1}
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-[#1d3557]">{question.questionDescription}</p>
            <p className="mt-1 text-xs uppercase tracking-wider text-[#6097b9]">
              {question.difficultyRating || "Question"} · {question.userAnswer ? "Answered" : "No answer"}
            </p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <span className="border border-[#89aad8] px-3 py-1 text-sm font-black text-[#1d3557]">
            {score}/100
          </span>
          <FiChevronDown className={`text-[#457b9d] transition-transform ${open ? "rotate-180" : ""}`} />
        </div>
      </button>
      {open && (
        <div className="border-t border-[#c4d4eb] bg-[#f7fcf6] p-5">
          <p className="text-xs font-bold uppercase tracking-wider text-[#457b9d]">Feedback</p>
          <p className="mt-2 text-sm leading-6 text-[#1d3557]">
            {feedback.feedback || "No written feedback was recorded."}
          </p>
          {Array.isArray(feedback.suggestions) && feedback.suggestions.length > 0 && (
            <div className="mt-4">
              <p className="text-xs font-bold uppercase tracking-wider text-[#457b9d]">Suggestions</p>
              <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-[#37627d]">
                {feedback.suggestions.map((suggestion, suggestionIndex) => (
                  <li key={`${suggestion}-${suggestionIndex}`}>{suggestion}</li>
                ))}
              </ul>
            </div>
          )}
          {question.userAnswer && (
            <div className="mt-4 border-l-2 border-[#a8dadc] pl-4">
              <p className="text-xs font-bold uppercase tracking-wider text-[#457b9d]">Your answer</p>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-[#37627d]">{question.userAnswer}</p>
            </div>
          )}
        </div>
      )}
    </article>
  );
};

const ReportPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const loadReport = async () => {
      const response = await getInterviewSession(id);
      if (!active) return;
      if (!response?.interviewSession) {
        setError("Unable to load this interview report.");
      } else {
        setInterview(response.interviewSession);
      }
      setLoading(false);
    };

    loadReport();
    return () => {
      active = false;
    };
  }, [id]);

  const answeredQuestions = useMemo(
    () => interview?.questionBank?.filter((question) => question.userAnswer)?.length || 0,
    [interview],
  );

  if (loading) {
    return <div className="p-8 text-sm font-semibold text-[#457b9d]">Loading your interview report...</div>;
  }

  if (error || !interview) {
    return (
      <main className="p-8">
        <p className="font-semibold text-[#e63946]">{error || "Report not found."}</p>
        <button className="mt-4 border-2 border-[#1d3557] px-4 py-2 text-sm font-bold text-[#1d3557]" onClick={() => navigate("/dashboard")} type="button">
          Back to dashboard
        </button>
      </main>
    );
  }

  const score = Number(interview.finalScore) || 0;
  const questions = interview.questionBank || [];

  return (
    <main className="mx-auto max-w-6xl space-y-8 pb-12">
      <header className="flex flex-wrap items-start justify-between gap-4 border-b border-[#c4d4eb] pb-6">
        <div>
          <button className="mb-5 flex items-center gap-2 text-sm font-bold text-[#457b9d] hover:text-[#1d3557]" onClick={() => navigate("/dashboard")} type="button">
            <FiArrowLeft /> Dashboard
          </button>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#e63946]">Interview report</p>
          <h1 className="mt-2 text-3xl font-black text-[#1d3557]">Your performance review</h1>
          <p className="mt-2 text-sm text-[#457b9d]">
            {interview.interviewRole} · {interview.interviewType}
          </p>
        </div>
        <div className="border-2 border-[#1d3557] bg-[#f1faee] px-8 py-5 text-center shadow-[5px_5px_0_#a8dadc]">
          <p className="text-xs font-bold uppercase tracking-wider text-[#457b9d]">Overall score</p>
          <p className="mt-1 text-5xl font-black text-[#1d3557]">{score}</p>
          <p className="text-xs font-bold text-[#6097b9]">out of 100</p>
        </div>
      </header>

      <section className="grid gap-4 sm:grid-cols-3">
        <div className="border-2 border-[#c4d4eb] bg-white p-5">
          <FiTarget className="text-[#e63946]" size={22} />
          <p className="mt-4 text-xs font-bold uppercase tracking-wider text-[#6097b9]">Questions answered</p>
          <p className="mt-1 text-2xl font-black text-[#1d3557]">{answeredQuestions}/{questions.length}</p>
        </div>
        <div className="border-2 border-[#c4d4eb] bg-white p-5">
          <FiTrendingUp className="text-[#457b9d]" size={22} />
          <p className="mt-4 text-xs font-bold uppercase tracking-wider text-[#6097b9]">Interview status</p>
          <p className="mt-1 text-2xl font-black capitalize text-[#1d3557]">{interview.status}</p>
        </div>
        <div className="border-2 border-[#c4d4eb] bg-white p-5">
          <FiClock className="text-[#457b9d]" size={22} />
          <p className="mt-4 text-xs font-bold uppercase tracking-wider text-[#6097b9]">Interview format</p>
          <p className="mt-1 text-2xl font-black capitalize text-[#1d3557]">{interview.interviewType}</p>
        </div>
      </section>

      <section className="border-2 border-[#1d3557] bg-[#f1faee] p-6 sm:p-8">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#e63946]">Interview summary</p>
        <p className="mt-3 max-w-4xl text-base leading-7 text-[#1d3557]">
          {interview.summary || "Your interview summary is not available yet."}
        </p>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <ListCard items={interview.strengths || []} title="Strengths" tone="bg-[#d7e5ee] text-[#1d3557]" />
        <ListCard items={interview.weaknesses || []} title="Areas to improve" tone="bg-[#fad7da] text-[#e63946]" />
      </div>

      <ListCard items={interview.recommendations || []} title="Recommendations" tone="bg-[#f1faee] text-[#457b9d]" />

      {Array.isArray(interview.keyMissingPoints) && interview.keyMissingPoints.length > 0 && (
        <ListCard items={interview.keyMissingPoints} title="Key points to revisit" tone="bg-[#fad7da] text-[#e63946]" />
      )}

      <section>
        <div className="mb-4">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#e63946]">Question review</p>
          <h2 className="mt-2 text-2xl font-black text-[#1d3557]">Detailed feedback</h2>
        </div>
        <div className="space-y-3">
          {questions.map((question, index) => (
            <QuestionReview index={index} key={`${question.questionDescription}-${index}`} question={question} />
          ))}
        </div>
      </section>
    </main>
  );
};

export default ReportPage;
