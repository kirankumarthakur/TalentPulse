import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import { useState } from "react";
import { useEffect } from "react";
import { getCurrentUser } from "./services/user.api";

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    let loadingTimer;
    const minimumLoadingTime = 400;
    const startedAt = Date.now();

    const fetchCurrentUser = async () => {
      try {
        const userData = await getCurrentUser();
        if (isMounted) setUser(userData?.user);
      } finally {
        const remainingTime = Math.max(
          0,
          minimumLoadingTime - (Date.now() - startedAt),
        );

        loadingTimer = setTimeout(() => {
          if (isMounted) setLoading(false);
        }, remainingTime);
      }
    };

    fetchCurrentUser();

    return () => {
      isMounted = false;
      clearTimeout(loadingTimer);
    };
  }, []);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f1faee] px-6 font-['Inter',sans-serif] text-[#1d3557]">
        <section
          aria-label="Loading TalentPulse"
          className="relative w-full max-w-sm border-2 border-[#1d3557] bg-white p-8 shadow-[10px_10px_0_#a8dadc] sm:p-10"
        >
          <div className="absolute -right-2 -top-2 h-5 w-5 bg-[#e63946]" />
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center bg-[#e63946] text-lg font-black text-[#f1faee]">
              T
            </span>
            <span className="text-xl font-bold tracking-tight">
              TalentPulse
            </span>
          </div>

          <div className="mt-12">
            <div className="flex items-center gap-3">
              <span className="h-3 w-3 animate-pulse bg-[#e63946]" />
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#457b9d]">
                Preparing your workspace
              </p>
            </div>
            <div className="mt-6 h-2 w-full overflow-hidden bg-[#d7e5ee]">
              <div className="h-full w-1/2 animate-pulse bg-[#457b9d]" />
            </div>
            <p className="mt-4 text-sm leading-6 text-[#37627d]">
              Getting everything ready for your next interview practice session.
            </p>
          </div>
        </section>
      </main>
    );
  }

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            user ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Home setUser={setUser} />
            )
          }
        />
        <Route
          path="/dashboard/*"
          element={
            user ? (
              <Dashboard user={user} setUser={setUser} />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
      </Routes>
    </>
  );
};

export default App;
