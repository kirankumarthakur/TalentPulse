import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { FiArrowRight, FiCheck, FiZap } from "react-icons/fi";
import api from "../utils/axios";
import { useNavigate } from "react-router-dom";
import { getBillingPlans } from "../services/billing.api";

const Billing = ({ user, setUser }) => {
  const navigate = useNavigate();
  const [plans, setPlans] = useState(null);
  const [loading, setLoading] = useState(true);
  const [payingPlan, setPayingPlan] = useState(null);

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

  const handlePayment = async (planId) => {
    try {
      setPayingPlan(planId);
      const result = await api.post("/api/billing/create", {
        planId: planId,
      });
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: result.data.amount || result.data.order?.amount,
        currency: result.data.currency || result.data.order?.currency || "INR",
        name: "TalentPulse",
        description: "${plan.title} - ${plan.credits} credits",
        order_id: result.data.order.id,

        handler: async function (response) {
          try {
            await api.post("/api/billing/verify", response);
            const credits = await api.post("/api/auth/addcredits", {
              credits: result.data.credits,
            });
            setUser((prevUser) => ({
              ...prevUser,
              credits: credits.data.credits ?? (prevUser.credits + credits.data.addedCredits),
            }));
            alert("Payment successful! Credits added to your account.");
            navigate("/dashboard");
          } catch (error) {
            alert("Payment verification failed. Please contact support.");
            console.error("Error verifying payment:", error);
          }
        },

        theme: {
          color: "#060707",
        },
      };
      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Error creating payment order:", error);
    } finally {
      setPayingPlan(null);
    }
  };

  const planEntries = plans ? Object.entries(plans) : [];

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25 }}
      className="mx-auto max-w-6xl space-y-8"
    >
      <header className="border-b border-[#c4d4eb] pb-8">
        <div className="flex items-center gap-2">
          <span className="flex h-5 w-5 items-center justify-center bg-[#e63946] text-xs font-bold text-[#f1faee]">
            <FiZap size={12} />
          </span>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#e63946]">
            Credit Packs
          </p>
        </div>
        <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-4xl font-black tracking-[-0.03em] text-[#1d3557]">
              Get Practice Credits
            </h1>
            <p className="mt-2 text-base text-[#457b9d]">
              Choose a pack to continue your mock interviews and resume scoring.
            </p>
          </div>
          <div className="flex items-center gap-3 border-2 border-[#1d3557] bg-white px-4 py-2.5 shadow-[3px_3px_0_#1d3557]">
            <span className="text-xs font-bold uppercase tracking-wider text-[#457b9d]">
              Current balance:
            </span>
            <span className="text-lg font-black text-[#1d3557]">
              {user?.credits ?? 0} Credits
            </span>
          </div>
        </div>
      </header>

      {loading ? (
        <div className="flex h-64 items-center justify-center text-sm font-semibold text-[#457b9d]">
          Loading available credit packs...
        </div>
      ) : (
        <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {planEntries.map(([planKey, plan], index) => (
            <motion.article
              key={planKey}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.06 + 0.05, duration: 0.25 }}
              whileHover={{ y: -4, transition: { duration: 0.15 } }}
              className="flex flex-col justify-between border-2 border-[#1d3557] bg-white p-6 shadow-[5px_5px_0_#1d3557] transition-shadow hover:shadow-[8px_8px_0_#1d3557]"
            >
              <div>
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold uppercase tracking-wider text-[#457b9d]">
                    {plan.name}
                  </p>
                  {planKey === "pro" && (
                    <span className="bg-[#e63946] px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-[#f1faee]">
                      Popular
                    </span>
                  )}
                </div>

                <div className="mt-5">
                  <span className="text-4xl font-black text-[#1d3557]">
                    {plan.credits}
                  </span>
                  <span className="ml-2 text-sm font-bold text-[#457b9d]">
                    Credits
                  </span>
                </div>

                <div className="mt-5 border-t border-[#c4d4eb] pt-4">
                  <span className="text-2xl font-black text-[#e63946]">
                    ₹{plan.price}
                  </span>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={payingPlan === planKey}
                onClick={() => handlePayment(planKey)}
                type="button"
                className="mt-8 flex w-full items-center justify-center gap-2 border-2 border-[#1d3557] bg-[#1d3557] py-3 text-sm font-bold text-[#f1faee] transition-colors hover:border-[#e63946] hover:bg-[#e63946] disabled:opacity-50"
              >
                {payingPlan === planKey ? (
                  "Opening Checkout..."
                ) : (
                  <>
                    Buy {plan.credits} Credits <FiArrowRight size={16} />
                  </>
                )}
              </motion.button>
            </motion.article>
          ))}
        </section>
      )}

      <motion.footer
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.25 }}
        className="border-2 border-[#89aad8] bg-[#f1faee] p-6 shadow-[4px_4px_0_#89aad8]"
      >
        <div className="flex flex-col gap-4 text-xs text-[#457b9d] sm:flex-row sm:items-center sm:justify-between">
          <span className="flex items-center gap-2 font-semibold">
            <FiCheck className="text-[#e63946]" size={16} /> Pay securely with UPI, cards, and net banking via Razorpay
          </span>
          <span className="font-semibold text-[#1d3557]">
            Credits never expire and apply to mock interviews and resume scoring
          </span>
        </div>
      </motion.footer>
    </motion.main>
  );
};

export default Billing;
