import React, { useState } from "react";
import { FiArrowRight, FiClock, FiPlay, FiTrendingUp } from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import api from "../utils/axios";

const pageDetails = {
  "/dashboard/resume/enhance": [
    "Enhance Resume",
    "Polish your resume before your next application.",
  ],
  "/dashboard/resume/score": [
    "Resume Score",
    "See how clearly your experience comes through.",
  ],
  "/dashboard/roadmap": [
    "Roadmap Builder",
    "Turn your target role into a focused preparation plan.",
  ],
};

const Dashboard = ({ user, setUser }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [heading, description] = pageDetails[location.pathname] || [
    "Good to see you",
    "Your interview preparation, all in one place.",
  ];
  const displayName = user.username;

  const handleLogout = async () => {
    try {
      await api.get("/api/auth/logout");
      setUser(null);
      navigate("/");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#f1faee] font-['Inter',sans-serif] text-[#1d3557]">
      <Sidebar
        user={user}
        onLogout={handleLogout}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        onNewInterview={() => navigate("/dashboard/interviews/new")}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />
      <main
        className={`min-h-screen px-6 pb-16 pt-24 transition-[padding] lg:px-10 lg:pt-10 ${sidebarOpen ? "lg:pl-[296px]" : "lg:pl-[120px]"}`}
      >
        <header className="mx-auto max-w-6xl border-b border-[#c4d4eb] pb-8">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#e63946]">
            Your workspace
          </p>
          <h1 className="mt-3 text-4xl font-black tracking-[-0.03em] text-[#1d3557]">
            {heading}, {displayName}.
          </h1>
          <p className="mt-3 text-base text-[#457b9d]">{description}</p>
        </header>

        {location.pathname === "/dashboard" ? (
          <div className="mx-auto max-w-6xl">
            <section className="mt-8 grid gap-4 md:grid-cols-3">
              {[
                ["Practice sessions", "0", FiPlay],
                ["Average confidence", "—", FiTrendingUp],
                ["Time this week", "0 min", FiClock],
              ].map(([label, value, Icon]) => (
                <article
                  key={label}
                  className="border-2 border-[#89aad8] bg-white p-6"
                >
                  <Icon className="text-[#e63946]" size={21} />
                  <p className="mt-8 text-sm font-semibold text-[#457b9d]">
                    {label}
                  </p>
                  <p className="mt-2 text-3xl font-black text-[#1d3557]">
                    {value}
                  </p>
                </article>
              ))}
            </section>
            <section className="mt-8 border-2 border-[#1d3557] bg-[#d7e5ee] p-8 sm:p-10">
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
                onClick={() => navigate("/dashboard/interviews/new")}
                type="button"
              >
                Start an interview <FiArrowRight />
              </button>
            </section>
          </div>
        ) : (
          <section className="mx-auto mt-8 max-w-6xl border-2 border-[#89aad8] bg-white p-8">
            <p className="text-[#457b9d]">
              This workspace is ready for your next preparation step.
            </p>
          </section>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
