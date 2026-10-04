import React, { useEffect } from "react";
import { FiArrowUpRight, FiX } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { signInWithGoogle } from "../utils/firebase";
import api from "../utils/axios";

const LoginModal = ({ onClose, setUser }) => {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handleGoogleSignIn = async () => {
    try {
      const { photoURL, token } = await signInWithGoogle();

      const response = await api.post("/api/auth/login", { token });
      setUser({
        ...response?.data?.user,
        photoURL,
      });
      onClose();
    } catch (error) {
      console.error("Error signing in with Google:", error);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#060b12]/70 px-5 py-8 backdrop-blur-sm"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        aria-labelledby="login-title"
        aria-modal="true"
        className="relative w-full max-w-md border border-[#c4d4eb] bg-[#f1faee] p-8 shadow-[12px_12px_0_#a8dadc] sm:p-10"
        role="dialog"
      >
        <button
          aria-label="Close login dialog"
          className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center border border-[#89aad8] text-[#1d3557] transition-colors hover:bg-[#d7e5ee] focus:outline-none focus:ring-2 focus:ring-[#e63946]"
          onClick={onClose}
          type="button"
        >
          <FiX size={20} />
        </button>

        <div className="mb-8 flex h-12 w-12 items-center justify-center bg-[#e63946] text-xl font-black text-[#f1faee]">
          T
        </div>
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#457b9d]">
          Welcome back
        </p>
        <h2
          id="login-title"
          className="max-w-xs text-3xl font-bold tracking-tight text-[#1d3557]"
        >
          Pick up where you left off.
        </h2>
        <p className="mt-4 max-w-sm text-sm leading-6 text-[#37627d]">
          Sign in to join us in building the future of talent.
        </p>

        <button
          onClick={handleGoogleSignIn}
          className="mt-8 flex w-full items-center justify-between border-2 border-[#1d3557] bg-white px-4 py-3.5 text-left text-sm font-bold text-[#1d3557] transition-[transform,box-shadow,background-color] hover:-translate-y-0.5 hover:bg-[#edf8f8] hover:shadow-[4px_4px_0_#a8dadc] focus:outline-none focus:ring-2 focus:ring-[#e63946] focus:ring-offset-2 focus:ring-offset-[#f1faee]"
          type="button"
        >
          <span className="flex items-center gap-3">
            <span className="flex h-7 w-7 items-center justify-center border border-[#d7e5ee] text-base font-bold">
              <FcGoogle size={18} aria-hidden="true" />
            </span>
            Continue with Google
          </span>
          <FiArrowUpRight size={19} />
        </button>
      </section>
    </div>
  );
};

export default LoginModal;
