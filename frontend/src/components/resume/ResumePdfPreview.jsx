import React from "react";
import { motion } from "motion/react";
import { FiX } from "react-icons/fi";
import { PDFViewer } from "@react-pdf/renderer";
import EngineeringResumePdf from "./EngineeringResumePdf";
import ResumeDownloadButton from "./ResumeDownloadButton";

const ResumePdfPreview = ({ data, onClose, setUser, embedded = false }) => {
  const content = (
    <section className={`flex min-h-0 w-full flex-col border-2 border-[#1d3557] bg-[#f1faee] shadow-[10px_10px_0_#a8dadc] ${embedded ? "h-full" : "h-[95vh] max-w-5xl"}`}>
      <header className="flex items-center justify-between gap-3 border-b-2 border-[#c4d4eb] px-4 py-3 sm:px-6">
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#e63946]">Resume preview</p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <ResumeDownloadButton
            className="flex h-10 shrink-0 items-center gap-2 whitespace-nowrap border-2 border-[#1d3557] px-3 py-2 text-sm font-bold text-[#1d3557] hover:bg-[#d7e5ee]"
            data={data}
            label="Download"
            setUser={setUser}
          />
          <button
            aria-label="Cancel resume preview"
            className="flex h-10 w-10 shrink-0 items-center justify-center border-2 border-[#1d3557] text-[#e63946] hover:bg-[#fad7da]"
            onClick={onClose}
            type="button"
          >
            <FiX />
          </button>
        </div>
      </header>
      <div className="min-h-0 flex-1 bg-[#d7e5ee] p-3 sm:p-6">
        <PDFViewer className="h-full w-full border-0" showToolbar={false}>
          <EngineeringResumePdf key={JSON.stringify(data)} data={data} />
        </PDFViewer>
      </div>
    </section>
  );

  if (embedded) {
    return <div className="flex h-[75vh] w-full flex-col">{content}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#060b12]/60 p-4 sm:p-8 backdrop-blur-xs"
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 12 }}
        transition={{ type: "spring", damping: 26, stiffness: 320 }}
        className="flex min-h-0 w-full h-[95vh] max-w-5xl flex-col"
      >
        {content}
      </motion.div>
    </motion.div>
  );
};

export default ResumePdfPreview;
