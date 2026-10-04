import React from "react";
import {
  FiArrowRight,
  FiFileText,
} from "react-icons/fi";
import { useNavigate, useOutletContext } from "react-router-dom";

const Dashboard = ({ user }) => {
  const navigate = useNavigate();
  const { onNewInterview } = useOutletContext();

  return (
    <>
      <header className="mx-auto max-w-6xl border-b border-[#c4d4eb] pb-8">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#e63946]">
          Your workspace
        </p>
        <h1 className="mt-3 text-4xl font-black tracking-[-0.03em] text-[#1d3557]">
          Good to see you{user?.username ? `, ${user.username}` : ""}.
        </h1>
        <p className="mt-3 text-base text-[#457b9d]">
          Your interview preparation, all in one place.
        </p>
      </header>

      <div className="mx-auto mt-8 max-w-6xl space-y-8">
        <section className="border-2 border-[#1d3557] bg-[#d7e5ee] p-8 sm:p-10">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#e63946]">
            Ready when you are
          </p>
          <h2 className="mt-3 max-w-lg text-3xl font-black tracking-tight">
            Your next interview starts with one practice round.
          </h2>
          <p className="mt-4 max-w-xl leading-7 text-[#37627d]">
            Choose a role and let TalentPulse help you rehearse the
            questions that matter.
          </p>
          <button
            className="mt-8 flex items-center gap-3 bg-[#1d3557] px-5 py-3 text-sm font-bold text-[#f1faee] hover:shadow-[4px_4px_0_#e63946]"
            onClick={onNewInterview}
            type="button"
          >
            Start an interview <FiArrowRight />
          </button>
        </section>

        <section className="flex flex-col items-start justify-between gap-6 border-2 border-[#89aad8] bg-white p-6 sm:flex-row sm:items-center sm:p-8">
          <div className="flex items-start gap-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center bg-[#a8dadc] text-[#1d3557]">
              <FiFileText size={21} />
            </span>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#e63946]">
                Resume toolkit
              </p>
              <h2 className="mt-2 text-xl font-bold text-[#1d3557]">
                Check your resume score
              </h2>
              <p className="mt-2 text-sm leading-6 text-[#457b9d]">
                Upload your resume and see how ready it is for your next opportunity.
              </p>
            </div>
          </div>
          <button
            className="flex shrink-0 items-center gap-2 border-2 border-[#1d3557] px-5 py-3 text-sm font-bold text-[#1d3557] transition-colors hover:bg-[#d7e5ee]"
            onClick={() => navigate("/dashboard/resume/score")}
            type="button"
          >
            Score resume <FiArrowRight />
          </button>
        </section>
      </div>
    </>
  );
};

export default Dashboard;
