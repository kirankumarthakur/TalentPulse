import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

const TABS = [
  { id: "both", label: "All Interviews" },
  { id: "technical", label: "Technical" },
  { id: "behavioral", label: "Behavioral" },
];

const RadarCard = ({
  overallData,
  technicalData,
  behavioralData,
  loading = false,
}) => {
  const [activeTab, setActiveTab] = useState("both");

  const currentDataset =
    activeTab === "technical"
      ? technicalData
      : activeTab === "behavioral"
      ? behavioralData
      : overallData;

  const radarData = currentDataset?.radarData || [];
  const stats = currentDataset?.stats || {
    totalInterviews: 0,
    completedInterviews: 0,
    totalQuestions: 0,
    averageScore: 0,
  };

  const hasData =
    stats.completedInterviews > 0 &&
    radarData.some((item) => (item.score || 0) > 0);

  const width = 420;
  const height = 380;
  const centerX = width / 2;
  const centerY = height / 2;
  const maxRadius = 125;
  const totalAxes = radarData.length || 9;

  const getAngle = (index) => (2 * Math.PI * index) / totalAxes - Math.PI / 2;

  const getRingPoints = (ratio) => {
    return Array.from({ length: totalAxes })
      .map((_, i) => {
        const angle = getAngle(i);
        const r = maxRadius * ratio;
        const x = centerX + r * Math.cos(angle);
        const y = centerY + r * Math.sin(angle);
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(" ");
  };

  const dataPoints = radarData
    .map((item, i) => {
      const angle = getAngle(i);
      const score = item.score || 0;
      const r = (score / 100) * maxRadius;
      const x = centerX + r * Math.cos(angle);
      const y = centerY + r * Math.sin(angle);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  return (
    <section className="border-2 border-[#1d3557] bg-white p-6 shadow-[6px_6px_0_#1d3557] sm:p-8">
      <div className="flex flex-col gap-4 border-b border-[#c4d4eb] pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#e63946]">
            Skills Analytics
          </p>
          <h2 className="mt-1 text-2xl font-black text-[#1d3557]">
            Performance Radar
          </h2>
          <p className="mt-1 text-xs text-[#457b9d]">
            Averaged feedback across your interview practice rounds
          </p>
        </div>

        <div className="flex border-2 border-[#1d3557] bg-[#f1faee] p-1">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 text-xs font-bold transition-all ${
                activeTab === tab.id
                  ? "bg-[#1d3557] text-[#f1faee] shadow-sm"
                  : "text-[#457b9d] hover:text-[#1d3557]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="border border-[#c4d4eb] bg-[#f1faee] p-3">
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#457b9d]">
            Completed Interviews
          </p>
          <p className="mt-1 text-xl font-black text-[#1d3557]">
            {stats.completedInterviews}
          </p>
        </div>

        <div className="border border-[#c4d4eb] bg-[#f1faee] p-3">
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#457b9d]">
            Questions Answered
          </p>
          <p className="mt-1 text-xl font-black text-[#1d3557]">
            {stats.totalQuestions}
          </p>
        </div>

        <div className="border border-[#c4d4eb] bg-[#f1faee] p-3">
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#457b9d]">
            Average Score
          </p>
          <p className="mt-1 text-xl font-black text-[#e63946]">
            {stats.averageScore}%
          </p>
        </div>
      </div>

      <div className="mt-6 flex flex-col items-center justify-center">
        {loading ? (
          <div className="flex h-[380px] w-full items-center justify-center text-sm font-semibold text-[#457b9d]">
            Loading interview metrics...
          </div>
        ) : (
          <div className="relative w-full max-w-[420px]">
            <svg
              viewBox={`0 0 ${width} ${height}`}
              className="w-full overflow-visible"
            >
              {[0.25, 0.5, 0.75, 1.0].map((ratio) => (
                <polygon
                  key={ratio}
                  points={getRingPoints(ratio)}
                  fill="none"
                  stroke="#c4d4eb"
                  strokeWidth="1"
                  strokeDasharray={ratio === 1 ? undefined : "3 3"}
                />
              ))}

              {Array.from({ length: totalAxes }).map((_, i) => {
                const angle = getAngle(i);
                const x = centerX + maxRadius * Math.cos(angle);
                const y = centerY + maxRadius * Math.sin(angle);
                return (
                  <line
                    key={i}
                    x1={centerX}
                    y1={centerY}
                    x2={x}
                    y2={y}
                    stroke="#c4d4eb"
                    strokeWidth="1"
                  />
                );
              })}

              {hasData && (
                <AnimatePresence mode="wait">
                  <motion.polygon
                    key={activeTab}
                    points={dataPoints}
                    initial={{
                      opacity: 0,
                      scale: 0.6,
                      transformOrigin: `${centerX}px ${centerY}px`,
                    }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    fill="rgba(230, 57, 70, 0.25)"
                    stroke="#e63946"
                    strokeWidth="2.5"
                  />
                </AnimatePresence>
              )}

              {hasData &&
                radarData.map((item, i) => {
                  const angle = getAngle(i);
                  const score = item.score || 0;
                  const r = (score / 100) * maxRadius;
                  const x = centerX + r * Math.cos(angle);
                  const y = centerY + r * Math.sin(angle);

                  return (
                    <motion.circle
                      key={i + activeTab}
                      cx={x}
                      cy={y}
                      r={4}
                      fill="#1d3557"
                      stroke="#f1faee"
                      strokeWidth="1.5"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.1 + i * 0.03 }}
                    />
                  );
                })}

              {radarData.map((item, i) => {
                const angle = getAngle(i);
                const labelRadius = maxRadius + 22;
                const x = centerX + labelRadius * Math.cos(angle);
                const y = centerY + labelRadius * Math.sin(angle);

                const cos = Math.cos(angle);
                const textAnchor =
                  cos > 0.2 ? "start" : cos < -0.2 ? "end" : "middle";

                return (
                  <text
                    key={i}
                    x={x}
                    y={y + 4}
                    textAnchor={textAnchor}
                    className="fill-[#1d3557] font-sans text-[11px] font-bold tracking-tight"
                  >
                    {item.skill}
                    {hasData && (item.score || 0) > 0 && (
                      <tspan
                        dx="4"
                        className="fill-[#e63946] font-mono text-[10px] font-black"
                      >
                        {item.score}%
                      </tspan>
                    )}
                  </text>
                );
              })}
            </svg>

            {!hasData && (
              <div className="mt-3 text-center text-xs font-semibold text-[#457b9d]">
                No completed {activeTab === "both" ? "interview" : `${activeTab} interview`} records found yet.
              </div>
            )}
          </div>
        )}
      </div>

      {radarData.length > 0 && (
        <div className="mt-8 border-t border-[#c4d4eb] pt-6">
          <p className="text-xs font-bold uppercase tracking-wider text-[#457b9d]">
            Dimension Breakdown
          </p>
          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {radarData.map((item) => (
              <div
                key={item.skill}
                className="flex items-center justify-between border border-[#c4d4eb] bg-white px-3 py-2 text-xs"
              >
                <span className="font-semibold text-[#1d3557]">
                  {item.skill}
                </span>
                <span
                  className={`font-mono font-bold ${
                    (item.score || 0) >= 70
                      ? "text-[#1d3557]"
                      : (item.score || 0) > 0
                      ? "text-[#e63946]"
                      : "text-gray-400"
                  }`}
                >
                  {item.score || 0}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default RadarCard;
