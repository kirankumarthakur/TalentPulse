import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import { useState } from "react";
import { useEffect } from "react";
import { getCurrentUser } from "./services/user.api";
import { getResume } from "./services/resume.api";
import ResumeScore from "./pages/ResumeScore";
import ProtectedLayout from "./layouts/ProtectedLayout";
import BuildResume from "./pages/BuildResume";
import { useDispatch } from "react-redux";
import { setResume } from "./redux/resumeSlice.js";
import { observeAuthState } from "./utils/firebase";
import Interview from "./pages/Interview";
import ReportPage from "./components/interview/ReportPage";
import InterviewHistory from "./pages/InterviewHistory";
import Billing from "./pages/Billing";

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    let isMounted = true;
    let loadingTimer;
    const minimumLoadingTime = 400;
    const startedAt = Date.now();

    const fetchCurrentUser = async (firebaseUser) => {
      try {
        const userData = await getCurrentUser();
        if (isMounted && userData?.user) {
          setUser({
            ...userData.user,
            photoURL: firebaseUser?.photoURL || "",
          });
        }
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

    const unsubscribe = observeAuthState((firebaseUser) => {
      if (firebaseUser) {
        fetchCurrentUser(firebaseUser);
      } else if (isMounted) {
        setUser(null);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
      clearTimeout(loadingTimer);
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    const fetchResume = async () => {
      const result = await getResume();
      if (result) {
        dispatch(setResume(result.data));
      }
    };

    fetchResume();
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
          element={
            user ? (
              <ProtectedLayout user={user} setUser={setUser} />
            ) : (
              <Navigate to="/" replace />
            )
          }
        >
          <Route path="/dashboard" element={<Dashboard user={user} />} />
          <Route path="/dashboard/interviews" element={<InterviewHistory />} />
          <Route
            path="/dashboard/resume/build"
            element={<BuildResume user={user} setUser={setUser} />}
          />
          <Route
            path="/dashboard/resume/score"
            element={<ResumeScore user={user} setUser={setUser} />}
          />
          <Route
            path="/dashboard/interview/:id"
            element={<Interview user={user} setUser={setUser} />}
          />
          <Route
            path="/dashboard/interview/:id/report"
            element={<ReportPage user={user} setUser={setUser} />}
          />
          <Route
            path="/dashboard/billing"
            element={<Billing user={user} setUser={setUser} />}
          />
        </Route>
      </Routes>
    </>
  );
};

export default App;
