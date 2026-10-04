import React from "react";
import { FiX } from "react-icons/fi";

const PreviewList = ({ title, values }) =>
  values.length > 0 && (
    <div className="mt-7">
      <h3 className="text-sm font-bold uppercase tracking-[0.16em] text-[#e63946]">{title}</h3>
      <ul className="mt-3 space-y-2 text-sm text-[#37627d]">
        {values.map((value) => <li key={value}>• {value}</li>)}
      </ul>
    </div>
  );

const ResumePreview = ({ data, onClose }) => (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-[#060b12]/70 p-5"
    onMouseDown={(event) => event.target === event.currentTarget && onClose()}
  >
    <section className="max-h-[90vh] w-full max-w-2xl overflow-y-auto border-2 border-[#1d3557] bg-[#f1faee] p-6 shadow-[10px_10px_0_#a8dadc] sm:p-10">
      <div className="flex items-start justify-between border-b border-[#c4d4eb] pb-5">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#e63946]">Preview</p>
          <h2 className="mt-2 text-3xl font-black">{data.name || "Your name"}</h2>
          <p className="mt-2 text-sm text-[#457b9d]">
            {[data.email, data.mobile, data.location].filter(Boolean).join(" · ") || "Contact details will appear here"}
          </p>
        </div>
        <button aria-label="Close preview" onClick={onClose} type="button"><FiX size={22} /></button>
      </div>
      <p className="mt-6 leading-7 text-[#37627d]">{data.summary || "Your professional summary will appear here."}</p>
      <PreviewList title="Skills" values={data.skills.map((item) => item.name).filter(Boolean)} />
      <PreviewList title="Experience" values={data.experience.map((item) => [item.role, item.company].filter(Boolean).join(" at ")).filter(Boolean)} />
      <PreviewList title="Education" values={data.education.map((item) => [item.degree, item.institution].filter(Boolean).join(" · ")).filter(Boolean)} />
    </section>
  </div>
);

export default ResumePreview;
