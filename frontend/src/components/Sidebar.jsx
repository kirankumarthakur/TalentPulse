import React from "react";
import { motion } from "motion/react";
import {
  FiChevronLeft,
  FiChevronRight,
  FiCompass,
  FiFileText,
  FiLogOut,
  FiMap,
  FiMenu,
  FiMessageSquare,
  FiPlus,
  FiX,
} from "react-icons/fi";
import { NavLink } from "react-router-dom";

const navigation = [
  { label: "Overview", path: "/dashboard", icon: FiCompass },
  {
    label: "Enhance Resume",
    path: "/dashboard/resume/enhance",
    icon: FiFileText,
  },
  {
    label: "Resume Score",
    path: "/dashboard/resume/score",
    icon: FiMessageSquare,
  },
  { label: "Roadmap Builder", path: "/dashboard/roadmap", icon: FiMap },
];

const Sidebar = ({
  user,
  onLogout,
  sidebarOpen,
  setSidebarOpen,
  onNewInterview,
  mobileOpen,
  setMobileOpen,
}) => {
  const displayName = user.username;

  const content = (
    <>
      <div className="flex h-[76px] items-center border-b border-[#315a93] px-5">
        <NavLink
          to="/dashboard"
          className="flex min-w-0 items-center gap-3"
          onClick={() => setMobileOpen(false)}
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center bg-[#e63946] text-lg font-black text-[#f1faee]">
            T
          </span>
          {sidebarOpen && (
            <span className="truncate text-lg font-bold text-[#f1faee]">
              TalentPulse
            </span>
          )}
        </NavLink>
        <button
          aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          className="ml-auto hidden h-8 w-8 items-center justify-center text-[#a8dadc] transition-colors hover:bg-[#315a93] hover:text-[#f1faee] lg:flex"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          type="button"
        >
          {sidebarOpen ? (
            <FiChevronLeft size={18} />
          ) : (
            <FiChevronRight size={18} />
          )}
        </button>
        <button
          aria-label="Close navigation"
          className="ml-auto flex h-8 w-8 items-center justify-center text-[#a8dadc] lg:hidden"
          onClick={() => setMobileOpen(false)}
          type="button"
        >
          <FiX size={19} />
        </button>
      </div>

      <div className="p-4">
        <button
          className={`flex w-full items-center justify-center gap-2 bg-[#e63946] px-3 py-3 text-sm font-bold text-[#f1faee] transition-[transform,box-shadow] hover:-translate-y-0.5 hover:shadow-[4px_4px_0_#a8dadc] ${!sidebarOpen ? "lg:px-0" : ""}`}
          onClick={onNewInterview}
          type="button"
        >
          <FiPlus size={18} />
          {sidebarOpen && "New interview"}
        </button>
      </div>

      <nav className="flex-1 space-y-1 px-3" aria-label="Dashboard navigation">
        {navigation.map(({ label, path, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            end={path === "/dashboard"}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 border-l-2 px-3 py-3 text-sm font-semibold transition-colors ${
                isActive
                  ? "border-[#e63946] bg-[#315a93] text-[#f1faee]"
                  : "border-transparent text-[#a8dadc] hover:bg-[#172b46] hover:text-[#f1faee]"
              } ${!sidebarOpen ? "lg:justify-center lg:px-0" : ""}`
            }
          >
            <Icon size={19} />
            {sidebarOpen && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-[#315a93] p-4">
        <button
          aria-label="Add credits"
          className={`mb-4 flex w-full items-center justify-center gap-2 border-2 border-[#a8dadc] px-3 py-2.5 text-sm font-bold text-[#f1faee] transition-[transform,background-color] hover:-translate-y-0.5 hover:bg-[#315a93] ${!sidebarOpen ? "lg:px-0" : ""}`}
          type="button"
        >
          <span className="text-[#a8dadc]">{user.credits}</span>
          {sidebarOpen && <span>Credits</span>}
          <FiPlus size={17} />
        </button>
        <div
          className={`flex items-center gap-3 ${!sidebarOpen ? "lg:justify-center" : ""}`}
        >
          {user?.photoURL ? (
            <img
              className="h-9 w-9 shrink-0 border-2 border-[#a8dadc] object-cover"
              src={user.photoURL}
              alt=""
            />
          ) : (
            <span className="flex h-9 w-9 shrink-0 items-center justify-center bg-[#a8dadc] text-sm font-black text-[#1d3557]">
              {displayName.charAt(0).toUpperCase()}
            </span>
          )}
          {sidebarOpen && (
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-[#f1faee]">
                {displayName}
              </p>
              <p className="truncate text-xs text-[#a8dadc]">{user.email}</p>
            </div>
          )}
          {sidebarOpen && (
            <button
              aria-label="Log out"
              className="text-[#a8dadc] hover:text-[#e63946]"
              onClick={onLogout}
              type="button"
            >
              <FiLogOut size={18} />
            </button>
          )}
        </div>
      </div>
    </>
  );

  return (
    <>
      <button
        aria-label="Open navigation"
        className="fixed left-4 top-4 z-30 flex h-10 w-10 items-center justify-center border-2 border-[#1d3557] bg-[#f1faee] text-[#1d3557] lg:hidden"
        onClick={() => setMobileOpen(true)}
        type="button"
      >
        <FiMenu size={20} />
      </button>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-[#060b12]/60 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
      <motion.aside
        animate={{ width: sidebarOpen ? 256 : 80 }}
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-[#1d3557] transition-transform lg:z-20 lg:translate-x-0 ${mobileOpen ? "translate-x-0" : "-translate-x-full"} lg:flex`}
      >
        {content}
      </motion.aside>
    </>
  );
};

export default Sidebar;
