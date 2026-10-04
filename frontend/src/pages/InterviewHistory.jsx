import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { FiArrowRight, FiBarChart2, FiCheckCircle, FiClock, FiPlay } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { getAllInterviews, getInterviewHistory } from "../services/interview.api";
import RadarCard from "../components/interview/RadarCard";

const formatDate = (value) =>
  value
    ? new Intl.DateTimeFormat("en", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }).format(new Date(value))
    : "Date unavailable";

const ScoreGraph = ({ interviews }) => {
  if (interviews.length < 2) {
    return (
      <div className="flex h-56 items-center justify-center border-2 border-dashed border-[#89aad8] text-sm text-[#457b9d]">
        Complete at least two interviews to see your score trend.
      </div>
    );
  }

  const width = 760;
  const height = 220;
  const padding = 28;
  const points = interviews.map((interview, index) => {
    const x = padding + (index * (width - padding * 2)) / (interviews.length - 1);
    const y = height - padding - (Math.max(0, Math.min(100, interview.score)) / 100) * (height - padding * 2);
    return { x, y, score: interview.score };
  });
  const line = points.map(({ x, y }) => `${x},${y}`).join(" ");

  return (
    <div className="overflow-x-auto">
      <svg className="min-w-[620px]" height={height} role="img" viewBox={`0 0 ${width} ${height}`} width="100%">
        {[0, 25, 50, 75, 100].map((value) => {
          const y = height - padding - (value / 100) * (height - padding * 2);
          return (
            <g key={value}>
              <line stroke="#c4d4eb" strokeDasharray="3 5" x1={padding} x2={width - padding} y1={y} y2={y} />
              <text fill="#6097b9" fontSize="11" textAnchor="end" x={padding - 8} y={y + 4}>{value}</text>
            </g>
          );
        })}
        <polyline fill="none" points={line} stroke="#e63946" strokeWidth="3" />
        {points.map(({ x, y, score }, index) => (
          <g key={`${score}-${index}`}>
            <circle cx={x} cy={y} fill="#f1faee" r="5" stroke="#1d3557" strokeWidth="2" />
            <text fill="#1d3557" fontSize="11" textAnchor="middle" x={x} y={y - 12}>{score}</text>
          </g>
        ))}
      </svg>
    </div>
  );
};

const InterviewHistory = () => {
  const navigate = useNavigate();
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [radarData, setRadarData] = useState(null);
  const [radarLoading, setRadarLoading] = useState(true);

  useEffect(() => {
    let active = true;

    getInterviewHistory().then((response) => {
      if (!active) return;
      if (!response?.interviews) {
        setError("Unable to load your interview history.");
      } else {
        setInterviews(response.interviews);
      }
      setLoading(false);
    });

    getAllInterviews()
      .then((data) => {
        if (!active) return;
        if (data?.success) {
          setRadarData(data);
        }
      })
      .catch((err) => {
        console.error("Error fetching radar analytics:", err);
      })
      .finally(() => {
        if (active) setRadarLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const completedInterviews = useMemo(() => {
    return interviews.filter((interview) => interview.status === "completed");
  }, [interviews]);

  const metrics = useMemo(() => {
    const total = completedInterviews.length;
    const averageScore = total
      ? Math.round(
          completedInterviews.reduce(
            (sum, interview) => sum + (interview.score || 0),
            0,
          ) / total,
        )
      : 0;
    const averageQuestions = total
      ? Math.round(
          completedInterviews.reduce(
            (sum, interview) => sum + (interview.questionsAnswered || 0),
            0,
          ) / total,
        )
      : 0;
    const technical = completedInterviews.filter(
      (interview) => interview.interviewType === "technical",
    ).length;
    return { total, averageScore, averageQuestions, technical };
  }, [completedInterviews]);

  if (loading) return <p className="text-sm font-semibold text-[#457b9d]">Loading your interview history...</p>;

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25 }}
      className="mx-auto max-w-6xl space-y-8"
    >
      <header className="border-b border-[#c4d4eb] pb-8">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#e63946]">Practice analytics</p>
        <h1 className="mt-3 text-4xl font-black tracking-[-0.03em] text-[#1d3557]">Interview history</h1>
        <p className="mt-3 text-base text-[#457b9d]">Track your progress and learn from every practice round.</p>
      </header>

      {error && <p className="border-2 border-[#e63946] bg-[#fad7da] p-4 text-sm font-semibold text-[#e63946]">{error}</p>}

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          ["Completed interviews", metrics.total, FiCheckCircle],
          ["Average score", `${metrics.averageScore}/100`, FiBarChart2],
          ["Avg. questions", metrics.averageQuestions, FiClock],
          ["Technical rounds", metrics.technical, FiPlay],
        ].map(([label, value, Icon], index) => (
          <motion.article
            key={label}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.22 }}
            whileHover={{ y: -3, transition: { duration: 0.15 } }}
            className="border-2 border-[#89aad8] bg-white p-5 shadow-[3px_3px_0_#89aad8] transition-shadow hover:shadow-[5px_5px_0_#89aad8]"
          >
            <Icon className="text-[#e63946]" size={21} />
            <p className="mt-6 text-sm font-semibold text-[#457b9d]">{label}</p>
            <p className="mt-2 text-3xl font-black text-[#1d3557]">{value}</p>
          </motion.article>
        ))}
      </section>

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.25 }}
      >
        <RadarCard
          overallData={radarData?.both}
          technicalData={radarData?.technical}
          behavioralData={radarData?.behavioral}
          loading={radarLoading}
        />
      </motion.div>

      <motion.section
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.25 }}
        className="border-2 border-[#1d3557] bg-white p-6 sm:p-8 shadow-[6px_6px_0_#1d3557]"
      >
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#e63946]">Progress</p>
            <h2 className="mt-2 text-2xl font-black text-[#1d3557]">Score over time</h2>
          </div>
          <FiBarChart2 className="text-[#457b9d]" size={24} />
        </div>
        <ScoreGraph interviews={[...completedInterviews].reverse()} />
      </motion.section>

      <section>
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#e63946]">All sessions</p>
            <h2 className="mt-2 text-2xl font-black text-[#1d3557]">Past interviews</h2>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 bg-[#1d3557] px-4 py-2 text-sm font-bold text-[#f1faee] hover:bg-[#e63946]"
            onClick={() => navigate("/dashboard")}
            type="button"
          >
            Start new <FiArrowRight />
          </motion.button>
        </div>
        {completedInterviews.length === 0 ? (
          <div className="border-2 border-dashed border-[#89aad8] bg-white p-10 text-center">
            <p className="font-bold text-[#1d3557]">No completed interviews yet.</p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="mt-4 border-2 border-[#1d3557] px-4 py-2 text-sm font-bold text-[#1d3557] hover:bg-[#d7e5ee]"
              onClick={() => navigate("/dashboard")}
              type="button"
            >
              Start your first interview
            </motion.button>
          </div>
        ) : (
          <div className="space-y-3">
            {completedInterviews.map((interview, index) => (
              <motion.button
                key={interview.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.22 + Math.min(index * 0.04, 0.35), duration: 0.22 }}
                whileHover={{ y: -2, transition: { duration: 0.15 } }}
                className="flex w-full flex-wrap items-center justify-between gap-4 border-2 border-[#c4d4eb] bg-white p-5 text-left shadow-[2px_2px_0_#c4d4eb] transition-all hover:border-[#1d3557] hover:shadow-[4px_4px_0_#1d3557]"
                onClick={() => navigate(`/dashboard/interview/${interview.id}/report`)}
                type="button"
              >
                <div className="flex min-w-0 items-center gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center bg-[#d7e5ee] text-[#1d3557]"><FiBarChart2 /></span>
                  <div className="min-w-0">
                    <p className="truncate font-bold capitalize text-[#1d3557]">{interview.role}</p>
                    <p className="mt-1 text-xs capitalize text-[#6097b9]">{interview.interviewType} · {formatDate(interview.completedAt)} · {interview.questionsAnswered} questions</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xl font-black text-[#1d3557]">{interview.score}/100</span>
                  <FiArrowRight className="text-[#457b9d]" />
                </div>
              </motion.button>
            ))}
          </div>
        )}
      </section>
    </motion.main>
  );
};

export default InterviewHistory;
