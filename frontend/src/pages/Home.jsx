import React, { useState } from "react";
import { motion } from "motion/react";
import { FiArrowRight, FiCheck } from "react-icons/fi";
import LoginModal from "../components/LoginModal";

const Home = ({ setUser }) => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f1faee] font-['Inter',sans-serif] text-[#1d3557]">
      <motion.nav
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="fixed inset-x-0 top-0 z-40 border-b border-[#c4d4eb] bg-[#f1faee]/95 backdrop-blur-xl"
      >
        <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-6 lg:px-8">
          <a
            href="#home"
            className="flex items-center gap-3"
            aria-label="TalentPulse home"
          >
            <span className="flex h-10 w-10 items-center justify-center bg-[#e63946] text-lg font-black text-[#f1faee]">
              T
            </span>
            <span className="text-xl font-bold tracking-tight">
              TalentPulse
            </span>
          </a>
          <div className="flex items-center gap-3 text-sm font-bold sm:gap-8">
            <a
              href="#how-it-works"
              className="hidden text-[#457b9d] transition-colors hover:text-[#1d3557] md:block"
            >
              How it works
            </a>
            <button
              className="border-2 border-[#1d3557] bg-transparent px-5 py-2.5 text-[#1d3557] transition-colors hover:bg-[#d7e5ee] focus:outline-none focus:ring-2 focus:ring-[#e63946]"
              onClick={() => setIsLoginOpen(true)}
              type="button"
            >
              Log in
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Hero */}
      <main
        id="home"
        className="mx-auto max-w-7xl px-6 pb-20 pt-36 lg:px-8 lg:pt-44"
      >
        <section className="grid items-center gap-16 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="mb-6 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.24em] text-[#e63946]">
              <span className="h-px w-8 bg-[#e63946]" /> Prepare with confidence
            </p>
            <h1 className="max-w-3xl text-5xl font-black leading-[1.02] tracking-[-0.04em] text-[#1d3557] sm:text-6xl lg:text-7xl">
              Practice for the interview that gets you hired.
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-8 text-[#37627d]">
              TalentPulse is your AI interview practice partner. Prepare with
              realistic questions, sharpen your answers, and walk into every
              interview ready.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <button
                className="group flex items-center gap-3 bg-[#1d3557] px-6 py-3.5 text-sm font-bold text-[#f1faee] transition-[transform,box-shadow] hover:-translate-y-0.5 hover:shadow-[5px_5px_0_#e63946] focus:outline-none focus:ring-2 focus:ring-[#e63946] focus:ring-offset-2 focus:ring-offset-[#f1faee]"
                onClick={() => setIsLoginOpen(true)}
                type="button"
              >
                Get started{" "}
                <FiArrowRight className="transition-transform group-hover:translate-x-1" />
              </button>
              <a
                href="#how-it-works"
                className="px-3 py-3.5 text-sm font-bold text-[#457b9d] underline decoration-[#a8dadc] decoration-2 underline-offset-4 hover:text-[#1d3557]"
              >
                See how it works
              </a>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -right-3 -top-3 h-full w-full border-2 border-[#a8dadc]" />
            <div className="relative border-2 border-[#1d3557] bg-[#d7e5ee] p-7 sm:p-10">
              <div className="mb-12 flex items-center justify-between border-b border-[#89aad8] pb-5">
                <span className="text-sm font-bold text-[#1d3557]">
                  AI interview practice
                </span>
                <span className="bg-[#f1faee] px-2 py-1 text-xs font-bold text-[#457b9d]">
                  READY
                </span>
              </div>
              <div className="space-y-4">
                {[
                  "Tell me about yourself",
                  "Walk me through your experience",
                  "Why should we hire you?",
                ].map((question) => (
                  <div
                    key={question}
                    className="flex items-center justify-between border border-[#89aad8] bg-[#f1faee] p-4"
                  >
                    <span className="text-sm font-bold text-[#1d3557]">
                      {question}
                    </span>
                    <FiCheck className="text-[#e63946]" size={19} />
                  </div>
                ))}
              </div>
              <p className="mt-9 border-l-2 border-[#e63946] pl-4 text-sm leading-6 text-[#37627d]">
                Practice until your answers feel natural.
              </p>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section
          id="how-it-works"
          className="scroll-mt-24 mt-32 border-t border-[#c4d4eb] pt-16"
        >
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-[#e63946]">
                01 / Built for momentum
              </p>
              <h2 className="max-w-md text-4xl font-black leading-tight tracking-[-0.03em] text-[#1d3557]">
                A better way to prepare for your next interview.
              </h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                [
                  "01",
                  "Choose your role",
                  "Select the role or interview type you are preparing for.",
                ],
                [
                  "02",
                  "Practice with AI",
                  "Answer realistic questions in a focused, private practice session.",
                ],
                [
                  "03",
                  "Improve each time",
                  "Use every practice round to build clarity, confidence, and composure.",
                ],
              ].map(([number, title, description]) => (
                <article
                  key={number}
                  className="border-2 border-[#89aad8] bg-white p-6"
                >
                  <span className="text-sm font-black text-[#e63946]">
                    {number}
                  </span>
                  <h3 className="mt-10 text-lg font-bold text-[#1d3557]">
                    {title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-[#457b9d]">
                    {description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#c4d4eb] bg-[#d7e5ee]">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-8 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center bg-[#e63946] text-base font-black text-[#f1faee]">
              T
            </span>
            <div>
              <p className="text-sm font-bold text-[#1d3557]">TalentPulse</p>
              <p className="text-xs text-[#457b9d]">
                Practice smarter. Interview stronger.
              </p>
            </div>
          </div>
          <a
            className="inline-flex w-fit border-2 border-[#1d3557] px-5 py-2.5 text-sm font-bold text-[#1d3557] transition-colors hover:bg-[#f1faee] focus:outline-none focus:ring-2 focus:ring-[#e63946]"
            href="mailto:"
          >
            Contact us
          </a>
        </div>
      </footer>

      {isLoginOpen && (
        <LoginModal onClose={() => setIsLoginOpen(false)} setUser={setUser} />
      )}
    </div>
  );
};

export default Home;
