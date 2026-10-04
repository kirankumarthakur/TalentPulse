import React, { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import ConfigureStep from "../components/interview/ConfigureStep";
import api from "../utils/axios";

const ProtectedLayout = ({ user, setUser }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showConfigure, setShowConfigure] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isInterviewSession = location.pathname.startsWith(
    "/dashboard/interview/",
  );

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
      {!isInterviewSession && (
        <Sidebar
          user={user}
          onLogout={handleLogout}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          onNewInterview={() => setShowConfigure(true)}
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
        />
      )}
      <main
        className={`min-h-screen ${
          isInterviewSession
            ? "px-4 py-4 sm:px-8"
            : `px-6 pb-16 pt-24 transition-[padding] duration-250 ease-in-out lg:pr-10 lg:pt-10 ${
                sidebarOpen ? "md:pl-[296px]" : "md:pl-[104px]"
              }`
        }`}
      >
        <Outlet context={{ onNewInterview: () => setShowConfigure(true) }} />
      </main>
      {showConfigure && (
        <ConfigureStep
          user={user}
          setUser={setUser}
          onClose={() => setShowConfigure(false)}
        />
      )}
    </div>
  );
};

export default ProtectedLayout;
