import React from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  FiChevronLeft,
  FiChevronRight,
  FiCompass,
  FiFileText,
  FiBarChart2,
  FiLogOut,
  FiMenu,
  FiMessageSquare,
  FiPlus,
  FiX,
} from "react-icons/fi";
import { NavLink, useNavigate } from "react-router-dom";

const navigation = [
  { label: "Overview", path: "/dashboard", icon: FiCompass },
  {
    label: "Build Resume",
    path: "/dashboard/resume/build",
    icon: FiFileText,
  },
  {
    label: "Resume Score",
    path: "/dashboard/resume/score",
    icon: FiMessageSquare,
  },
  {
    label: "Interview history",
    path: "/dashboard/interviews",
    icon: FiBarChart2,
  },
];

const formatCredits = (credits = 0) =>
  new Intl.NumberFormat("en", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(Number(credits) || 0);

const Sidebar = ({
  user,
  onLogout,
  sidebarOpen,
  setSidebarOpen,
  onNewInterview,
  mobileOpen,
  setMobileOpen,
}) => {
  const navigate = useNavigate();
  const displayName = user.username;
  const isExpanded = sidebarOpen || mobileOpen;

  const content = (
    <>
      <div
        className={`relative flex h-[76px] items-center border-b border-[#315a93] ${isExpanded ? "px-5" : "justify-center"}`}
      >
        <NavLink
          to="/dashboard"
          className={`absolute left-5 flex min-w-0 items-center gap-3 transition-[opacity,transform] duration-150 ${isExpanded ? "opacity-100" : "pointer-events-none -translate-x-2 opacity-0"}`}
          onClick={() => setMobileOpen(false)}
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center bg-[#e63946] text-lg font-black text-[#f1faee]">
            T
          </span>
          <span className="truncate text-lg font-bold text-[#f1faee]">
            TalentPulse
          </span>
        </NavLink>
        <button
          aria-label={isExpanded ? "Collapse sidebar" : "Expand sidebar"}
          className={`hidden items-center justify-center text-[#a8dadc] transition-colors hover:bg-[#315a93] hover:text-[#f1faee] md:flex ${isExpanded ? "absolute right-5 h-8 w-8" : "absolute inset-0 m-auto h-11 w-12 bg-[#172b46]"}`}
          onClick={() => setSidebarOpen(!isExpanded)}
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
          className="ml-auto flex h-8 w-8 items-center justify-center text-[#a8dadc] md:hidden"
          onClick={() => setMobileOpen(false)}
          type="button"
        >
          <FiX size={19} />
        </button>
      </div>

      <div className={isExpanded ? "p-4" : "p-2"}>
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          className={`flex items-center justify-center bg-[#e63946] text-sm font-bold text-[#f1faee] transition-[box-shadow] hover:shadow-[4px_4px_0_#a8dadc] ${
            isExpanded ? "w-full gap-2 px-3 py-3" : "mx-auto h-11 w-12 px-0"
          }`}
          onClick={onNewInterview}
          type="button"
        >
          <FiPlus size={18} className="shrink-0" />
          <AnimatePresence initial={false}>
            {isExpanded && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden truncate whitespace-nowrap"
              >
                New interview
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      <nav
        className={`flex-1 space-y-1 ${isExpanded ? "px-3" : "px-0"}`}
        aria-label="Dashboard navigation"
      >
        {navigation.map(({ label, path, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            end={path === "/dashboard"}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) => {
              const stateClasses = isActive
                ? "bg-[#315a93] text-[#f1faee]"
                : "text-[#a8dadc] hover:bg-[#172b46] hover:text-[#f1faee]";
              const sizeClasses = isExpanded
                ? "w-full border-l-2 px-3 py-3 gap-3"
                : "mx-auto h-11 w-12 justify-center border-l-0 px-0 gap-0";

              return `relative flex items-center text-sm font-semibold transition-colors ${stateClasses} ${sizeClasses} ${
                isActive && isExpanded
                  ? "border-[#e63946]"
                  : "border-transparent"
              }`;
            }}
          >
            <Icon size={19} className="shrink-0" />
            <AnimatePresence initial={false}>
              {isExpanded && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden truncate whitespace-nowrap"
                >
                  {label}
                </motion.span>
              )}
            </AnimatePresence>
          </NavLink>
        ))}
      </nav>

      <div
        className={`border-t border-[#315a93] ${isExpanded ? "p-4" : "p-2"}`}
      >
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          aria-label="Add credits"
          onClick={() => {
            setMobileOpen(false);
            navigate("/dashboard/billing");
          }}
          className={`mb-4 flex items-center justify-center border-2 border-[#a8dadc] font-bold text-[#f1faee] transition-colors hover:bg-[#315a93] ${
            isExpanded
              ? "w-full gap-2 px-3 py-2.5 text-sm"
              : "mx-auto h-11 w-12 gap-0 text-xs px-0"
          }`}
          type="button"
        >
          <span className="shrink-0 whitespace-nowrap text-[#a8dadc]">
            {isExpanded ? (user?.credits ?? 0) : formatCredits(user?.credits)}
          </span>
          <AnimatePresence initial={false}>
            {isExpanded && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden truncate whitespace-nowrap"
              >
                Credits
              </motion.span>
            )}
          </AnimatePresence>
          <FiPlus size={sidebarOpen ? 17 : 14} className="shrink-0" />
        </motion.button>
        <div
          className={`flex items-center ${
            isExpanded ? "gap-3" : "justify-center"
          }`}
        >
          {user?.photoURL ? (
            <img
              className={`shrink-0 border-2 border-[#a8dadc] object-cover ${
                isExpanded ? "h-9 w-9" : "h-11 w-11"
              }`}
              src={user.photoURL}
              alt=""
            />
          ) : (
            <span
              className={`flex shrink-0 items-center justify-center bg-[#a8dadc] text-sm font-black text-[#1d3557] ${
                isExpanded ? "h-9 w-9" : "h-11 w-11"
              }`}
            >
              {displayName.charAt(0).toUpperCase()}
            </span>
          )}
          <AnimatePresence initial={false}>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className="min-w-0 flex-1 overflow-hidden"
              >
                <p className="truncate text-sm font-bold text-[#f1faee]">
                  {displayName}
                </p>
                <p className="truncate text-xs text-[#a8dadc]">{user.email}</p>
              </motion.div>
            )}
          </AnimatePresence>
          <AnimatePresence initial={false}>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.15 }}
                className="shrink-0"
              >
                <button
                  aria-label="Log out"
                  className="text-[#a8dadc] hover:text-[#e63946]"
                  onClick={onLogout}
                  type="button"
                >
                  <FiLogOut size={18} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );

  return (
    <>
      <button
        aria-label="Open navigation"
        className="fixed left-4 top-4 z-30 flex h-10 w-10 items-center justify-center border-2 border-[#1d3557] bg-[#f1faee] text-[#1d3557] md:hidden"
        onClick={() => setMobileOpen(true)}
        type="button"
      >
        <FiMenu size={20} />
      </button>
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-[#060b12]/60 md:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>
      <motion.aside
        initial={false}
        animate={{ width: isExpanded ? 256 : 64 }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
        className={`fixed inset-y-0 left-0 z-50 flex flex-col overflow-hidden bg-[#1d3557] transition-transform duration-200 md:z-20 md:translate-x-0 md:flex ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {content}
      </motion.aside>
    </>
  );
};

export default Sidebar;
