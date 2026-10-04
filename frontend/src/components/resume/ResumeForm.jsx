import React, { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  FiArrowLeft,
  FiArrowRight,
  FiBriefcase,
  FiCheck,
  FiEye,
  FiFileText,
  FiBookOpen,
  FiUser,
} from "react-icons/fi";
import { createResumeData } from "./resumeData";
import EducationStep from "./steps/EducationStep";
import ExperienceStep from "./steps/ExperienceStep";
import PersonalInformationStep from "./steps/PersonalInformationStep";
import ProjectsCertificationsStep from "./steps/ProjectsCertificationsStep";
import SkillsStep from "./steps/SkillsStep";
import SummaryStep from "./steps/SummaryStep";
import ResumeFinalStep from "./ResumeFinalStep";
import ResumePdfPreview from "./ResumePdfPreview";
import ResumeDownloadButton from "./ResumeDownloadButton";

const steps = [
  {
    id: "personal",
    title: "Personal information",
    hint: "Start with the details recruiters use to reach you.",
    icon: FiUser,
    component: PersonalInformationStep,
    next: "summary",
  },
  {
    id: "summary",
    title: "Professional summary",
    hint: "Write a concise introduction to your experience.",
    icon: FiFileText,
    component: SummaryStep,
    next: "skills",
    previous: "personal",
  },
  {
    id: "skills",
    title: "Skills",
    hint: "Add the skills you want to be known for.",
    icon: FiCheck,
    component: SkillsStep,
    next: "experience",
    previous: "summary",
  },
  {
    id: "experience",
    title: "Experience",
    hint: "Show the work and impact behind your career.",
    icon: FiBriefcase,
    component: ExperienceStep,
    next: "education",
    previous: "skills",
  },
  {
    id: "education",
    title: "Education",
    hint: "Add your academic background and qualifications.",
    icon: FiBookOpen,
    component: EducationStep,
    next: "projects",
    previous: "experience",
  },
  {
    id: "projects",
    title: "Projects & certifications",
    hint: "Finish with proof of your work and learning.",
    icon: FiFileText,
    component: ProjectsCertificationsStep,
    next: "final",
    previous: "education",
  },
  {
    id: "final",
    title: "Your resume is ready",
    hint: "Review and download your completed engineering resume.",
    component: ResumeFinalStep,
    previous: "projects",
  },
];

const stepById = Object.fromEntries(steps.map((step) => [step.id, step]));
const hasRequiredValues = (items, fields) =>
  items.every((item) => fields.every((field) => item[field].trim()));

const ResumeForm = ({ step = 0, data = createResumeData(), setData = () => {}, user, setUser }) => {
  const initialStep = Math.min(Math.max(Number(step) || 0, 0), steps.length - 1);
  const [currentStepId, setCurrentStepId] = useState(steps[initialStep].id);
  const currentStep = stepById[currentStepId] || steps[0];
  const currentIndex = steps.findIndex((item) => item.id === currentStep.id);
  const StepComponent = currentStep.component;
  const [showPreview, setShowPreview] = useState(false);
  const canContinue = (() => {
    if (currentStep.id === "personal") {
      return data.name.trim() && data.email.trim();
    }
    if (currentStep.id === "skills") {
      return data.skills.length > 0 && hasRequiredValues(data.skills, ["name"]);
    }
    if (currentStep.id === "experience") {
      return hasRequiredValues(data.experience, ["role", "company"]);
    }
    if (currentStep.id === "education") {
      return hasRequiredValues(data.education, ["degree", "institution"]);
    }
    if (currentStep.id === "projects") {
      return hasRequiredValues(data.projects, ["name"])
        && hasRequiredValues(data.certifications, ["name"]);
    }
    return true;
  })();

  const updateData = (key, value) => {
    setData({ ...data, [key]: value });
  };

  const updateList = (key, index, field, value) => {
    const next = [...data[key]];
    next[index] = {
      ...next[index],
      [field]: value,
    };
    setData({ ...data, [key]: next });
  };

  const addEntry = (key, entry) => {
    setData({ ...data, [key]: [...data[key], entry] });
  };

  const removeEntry = (key, index) => {
    setData({
      ...data,
      [key]: data[key].filter((_, itemIndex) => itemIndex !== index),
    });
  };

  const renderStep = () => {
    const commonProps = {
      data,
      onChange: updateData,
    };

    if (currentStep.id === "summary") {
      return <StepComponent value={data.summary} onChange={(value) => updateData("summary", value)} />;
    }

    if (currentStep.id === "skills") {
      return (
        <StepComponent
          items={data.skills}
          onAdd={(entry) => addEntry("skills", entry)}
          onChange={(index, field, value) => updateList("skills", index, field, value)}
          onRemove={(index) => removeEntry("skills", index)}
        />
      );
    }

    if (currentStep.id === "experience" || currentStep.id === "education") {
      const key = currentStep.id;
      return (
        <StepComponent
          items={data[key]}
          onAdd={(entry) => addEntry(key, entry)}
          onChange={(index, field, value) => updateList(key, index, field, value)}
          onRemove={(index) => removeEntry(key, index)}
        />
      );
    }

    if (currentStep.id === "projects") {
      return (
        <StepComponent
          certifications={data.certifications}
          onAdd={addEntry}
          onChange={updateList}
          onRemove={removeEntry}
          projects={data.projects}
        />
      );
    }

    if (currentStep.id === "final") {
      return <StepComponent data={data} />;
    }

    return <StepComponent {...commonProps} />;
  };

  return (
    <section className="border-2 border-[#1d3557] bg-white p-6 shadow-[10px_10px_0_#a8dadc] sm:p-10">
      <div className="mb-10 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#e63946]">
            Step {currentIndex + 1} of {steps.length}
          </p>
          <h2 className="mt-2 text-2xl font-black text-[#1d3557]">{currentStep.title}</h2>
          <p className="mt-2 text-sm text-[#457b9d]">{currentStep.hint}</p>
          <p className="mt-2 text-xs text-[#457b9d]">
            <span className="font-bold text-[#e63946]">*</span> Required
          </p>
        </div>
        {currentStep.id === "final" ? (
          <ResumeDownloadButton
            className="flex shrink-0 items-center gap-2 border-2 border-[#1d3557] px-3 py-2 text-sm font-bold hover:bg-[#d7e5ee]"
            data={data}
            setUser={setUser}
            user={user}
          />
        ) : (
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className="flex shrink-0 items-center gap-2 border-2 border-[#1d3557] px-3 py-2 text-sm font-bold hover:bg-[#d7e5ee]"
            onClick={() => setShowPreview(true)}
            type="button"
          >
            <FiEye /> Preview
          </motion.button>
        )}
      </div>

      <div className="mb-10 flex gap-1">
        {steps.map((item, index) => (
          <button
            aria-label={`Go to ${item.title}`}
            className={`h-2 flex-1 transition-colors duration-200 ${index <= currentIndex ? "bg-[#e63946]" : "bg-[#d7e5ee]"}`}
            key={item.id}
            onClick={() => {
              setCurrentStepId(item.id);
            }}
            type="button"
          />
        ))}
      </div>
      <AnimatePresence>
        {showPreview && <ResumePdfPreview data={data} onClose={() => setShowPreview(false)} setUser={setUser} />}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentStepId}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          {renderStep()}
        </motion.div>
      </AnimatePresence>

      <div className="mt-10 flex justify-between border-t border-[#c4d4eb] pt-6">
        <motion.button
          whileHover={{ scale: !currentStep.previous ? 1 : 1.01 }}
          whileTap={{ scale: !currentStep.previous ? 1 : 0.98 }}
          className="flex items-center gap-2 border-2 border-[#1d3557] px-4 py-2.5 text-sm font-bold disabled:cursor-not-allowed disabled:opacity-30 hover:bg-[#d7e5ee]"
          disabled={!currentStep.previous}
          onClick={() => currentStep.previous && setCurrentStepId(currentStep.previous)}
          type="button"
        >
          <FiArrowLeft /> Previous
        </motion.button>
        {currentStep.next && (
          <motion.button
            whileHover={{ scale: !canContinue ? 1 : 1.01 }}
            whileTap={{ scale: !canContinue ? 1 : 0.98 }}
            className="flex items-center gap-2 bg-[#1d3557] px-4 py-2.5 text-sm font-bold text-[#f1faee] hover:shadow-[4px_4px_0_#e63946] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:shadow-none"
            disabled={!canContinue}
            onClick={() => canContinue && setCurrentStepId(currentStep.next)}
            type="button"
          >
            Next <FiArrowRight />
          </motion.button>
        )}
      </div>
    </section>
  );
};

export default ResumeForm;
