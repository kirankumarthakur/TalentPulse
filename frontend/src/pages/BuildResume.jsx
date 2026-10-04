import React, { useState } from "react";
import { motion } from "motion/react";
import ResumeForm from "../components/resume/ResumeForm";
import { createResumeData } from "../components/resume/resumeData";

const BuildResume = ({ user, setUser }) => {
  const [resumeData, setResumeData] = useState(createResumeData);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="mx-auto max-w-5xl"
    >
      <header className="mb-8 border-b border-[#c4d4eb] pb-8">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#e63946]">
          Resume toolkit
        </p>
        <h1 className="mt-3 text-4xl font-black tracking-[-0.03em] text-[#1d3557]">
          Build your resume.
        </h1>
        <p className="mt-3 max-w-xl text-base leading-7 text-[#457b9d]">
          Add your experience one step at a time and keep the details that make
          your work stand out.
        </p>
      </header>
      <ResumeForm data={resumeData} setData={setResumeData} user={user} setUser={setUser} />
    </motion.div>
  );
};

export default BuildResume;
