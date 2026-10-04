import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { FiX, FiZap } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { getBillingPlans } from "../services/billing.api";

const PlansModal = ({ onClose, user }) => {
  const navigate = useNavigate();
  const [plans, setPlans] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    let isMounted = true;

    getBillingPlans().then((data) => {
      if (isMounted && data?.plans) {
        setPlans(data.plans);
      }
      if (isMounted) {
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const planEntries = plans ? Object.entries(plans) : [];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#060b12]/70 px-4 py-8 backdrop-blur-xs"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 12 }}
        transition={{ type: "spring", damping: 26, stiffness: 320 }}
        className="relative w-full max-w-4xl border-2 border-[#1d3557] bg-white p-6 shadow-[8px_8px_0_#1d3557] sm:p-8"
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-[#c4d4eb] pb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center bg-[#e63946] text-xs font-bold text-[#f1faee]">
                <FiZap size={12} />
              </span>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#e63946]">
                Credit Packs
              </p>
            </div>
            <h2 className="mt-2 text-2xl font-black tracking-tight text-[#1d3557] sm:text-3xl">
              Get Practice Credits
            </h2>
            <p className="mt-1 text-sm text-[#457b9d]">
              Choose a pack to continue your mock interviews and resume reviews.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="border-2 border-transparent p-1 text-[#457b9d] transition hover:border-[#1d3557] hover:text-[#1d3557]"
          >
            <FiX size={22} />
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex h-64 items-center justify-center text-sm font-semibold text-[#457b9d]">
            Loading available plans...
          </div>
        ) : (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {planEntries.map(([planKey, plan], index) => (
              <motion.div
                key={planKey}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.06 + 0.05, duration: 0.25 }}
                whileHover={{ y: -4 }}
                className="flex flex-col justify-between border-2 border-[#1d3557] bg-[#f1faee] p-5 shadow-[3px_3px_0_#1d3557] transition-shadow hover:shadow-[5px_5px_0_#1d3557]"
              >
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-[#457b9d]">
                    {plan.name}
                  </p>

                  <div className="mt-4">
                    <span className="text-3xl font-black text-[#1d3557]">
                      {plan.credits}
                    </span>
                    <span className="ml-1.5 text-xs font-bold text-[#457b9d]">
                      Credits
                    </span>
                  </div>

                  <div className="mt-4 border-t border-[#c4d4eb] pt-3">
                    <span className="text-2xl font-black text-[#e63946]">
                      ₹{plan.price}
                    </span>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    onClose();
                    navigate("/dashboard/billing");
                  }}
                  type="button"
                  className="mt-6 w-full border-2 border-[#1d3557] bg-[#1d3557] py-2.5 text-xs font-bold text-[#f1faee] transition hover:bg-[#e63946] hover:border-[#e63946]"
                >
                  Buy {plan.credits} Credits
                </motion.button>
              </motion.div>
            ))}
          </div>
        )}

        {/* Footer info */}
        <div className="mt-6 flex items-center justify-between border-t border-[#c4d4eb] pt-4 text-xs text-[#457b9d]">
          <span>Pay securely with UPI, cards, and net banking</span>
          <span className="font-semibold text-[#1d3557]">
            Current balance: {user?.credits ?? 0} credits
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default PlansModal;
