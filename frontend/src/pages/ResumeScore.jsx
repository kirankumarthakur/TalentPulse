import React, { useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  FiArrowRight,
  FiCheck,
  FiFileText,
  FiLoader,
  FiUploadCloud,
  FiX,
} from "react-icons/fi";
import api from "../utils/axios";
import { useDispatch, useSelector } from "react-redux";
import { setResume } from "../redux/resumeSlice.js";
import { useCredits } from "../services/user.api.js";

const ResumeScore = ({ user, setUser }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isReuploading, setIsReuploading] = useState(false);
  const dispatch = useDispatch();
  const { resume } = useSelector((state) => state.resume);
  const inputRef = useRef(null);

  const handleFile = (selectedFile) => {
    if (!selectedFile) return;
    if (selectedFile.type !== "application/pdf") {
      console.error("Only PDF files can be uploaded.");
      return;
    }
    setFile(selectedFile);
  };

  const uploadResume = async () => {
    if (!file) return;

    try {
      setLoading(true);
      const creditResponse = await useCredits({
        credits: 10,
        action: "Score Resume",
      });
      setUser((prevUser) => ({
        ...prevUser,
        credits: creditResponse?.credits || prevUser.credits,
      }));

      const formData = new FormData();
      formData.append("resume", file);

      const response = await api.post("/api/resume/upload", formData);
      dispatch(setResume(response.data?.data));
      setIsReuploading(false);
      setFile(null);
    } catch (error) {
      console.error("Error uploading resume:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.25 }}
        className="mx-auto max-w-5xl"
      >
        <header className="border-b border-[#c4d4eb] pb-8">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#e63946]">
            Resume toolkit
          </p>
          <h1 className="mt-3 text-4xl font-black tracking-[-0.03em]">
            Score your resume.
          </h1>
          <p className="mt-3 max-w-xl text-base leading-7 text-[#457b9d]">
            Upload your resume and get a clearer picture of how ready it is for
            your next opportunity.
          </p>
        </header>

        <AnimatePresence mode="wait">
          {resume && !isReuploading ? (
            <ResumeResults
              key="results"
              resume={resume}
              onReupload={() => {
                setFile(null);
                setIsReuploading(true);
              }}
            />
          ) : (
            <ResumeUpload
              key="upload"
              file={file}
              inputRef={inputRef}
              loading={loading}
              handleFile={handleFile}
              setFile={setFile}
              uploadResume={uploadResume}
            />
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
};

const ResumeUpload = ({
  file,
  inputRef,
  loading,
  handleFile,
  setFile,
  uploadResume,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.2 }}
  >
    <div className="mt-10 flex items-center gap-3 text-sm font-bold">
      <span className="flex h-8 w-8 items-center justify-center bg-[#e63946] text-[#f1faee]">
        1
      </span>
      <span className="text-[#1d3557]">Upload resume</span>
      <span className="h-px w-10 bg-[#89aad8]" />
      <span className="flex h-8 w-8 items-center justify-center border-2 border-[#89aad8] text-[#457b9d]">
        2
      </span>
      <span className="text-[#457b9d]">View score</span>
    </div>

    <motion.section
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="mt-8 border-2 border-[#1d3557] bg-white p-6 shadow-[10px_10px_0_#a8dadc] sm:p-10"
    >
      <div
        className={`flex min-h-[280px] flex-col items-center justify-center border-2 border-dashed p-8 text-center transition-colors ${file ? "border-[#457b9d] bg-[#edf8f8]" : "border-[#89aad8] bg-[#f1faee] hover:bg-[#edf8f8]"}`}
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => {
          event.preventDefault();
          handleFile(event.dataTransfer.files[0]);
        }}
      >
        {file ? (
          <>
            <span className="flex h-14 w-14 items-center justify-center bg-[#a8dadc] text-[#1d3557]">
              <FiFileText size={26} />
            </span>
            <p className="mt-5 max-w-md truncate text-base font-bold">
              {file.name}
            </p>
            <p className="mt-2 text-sm text-[#457b9d]">
              {(file.size / 1024 / 1024).toFixed(2)} MB · PDF
            </p>
            <button
              className="mt-5 flex items-center gap-2 text-sm font-bold text-[#e63946] hover:text-[#99131e]"
              onClick={() => setFile(null)}
              type="button"
            >
              <FiX size={16} /> Remove file
            </button>
          </>
        ) : (
          <>
            <span className="flex h-14 w-14 items-center justify-center bg-[#d7e5ee] text-[#457b9d]">
              <FiUploadCloud size={27} />
            </span>
            <h2 className="mt-5 text-xl font-bold">Drop your resume here</h2>
            <p className="mt-2 text-sm text-[#457b9d]">
              PDF files only, up to 5 MB
            </p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="mt-6 border-2 border-[#1d3557] px-5 py-3 text-sm font-bold hover:bg-[#d7e5ee]"
              onClick={() => inputRef.current?.click()}
              type="button"
            >
              Choose PDF
            </motion.button>
            <input
              ref={inputRef}
              accept="application/pdf,.pdf"
              className="hidden"
              onChange={(event) => handleFile(event.target.files[0])}
              type="file"
            />
          </>
        )}
      </div>

      <div className="mt-8 flex flex-col items-start justify-between gap-5 border-t border-[#c4d4eb] pt-6 sm:flex-row sm:items-center">
        <p className="flex items-center gap-2 text-sm text-[#457b9d]">
          <FiCheck className="text-[#e63946]" /> Your resume stays private.
        </p>
        <motion.button
          whileHover={{ scale: !file || loading ? 1 : 1.01 }}
          whileTap={{ scale: !file || loading ? 1 : 0.98 }}
          className="flex w-full items-center justify-center gap-3 bg-[#1d3557] px-6 py-3.5 text-sm font-bold text-[#f1faee] transition-[transform,box-shadow,opacity] hover:-translate-y-0.5 hover:shadow-[4px_4px_0_#e63946] disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
          disabled={!file || loading}
          onClick={uploadResume}
          type="button"
        >
          {loading ? (
            <>
              <FiLoader className="animate-spin" /> Processing resume...
            </>
          ) : (
            <>
              Score resume <FiArrowRight />
            </>
          )}
        </motion.button>
      </div>
    </motion.section>
  </motion.div>
);

const ResumeResults = ({ resume, onReupload }) => {
  const insightSections = [
    ["Strengths", resume.strengths, "border-[#75ce57]", "text-[#234c16]"],
    [
      "Areas to improve",
      resume.weaknesses,
      "border-[#e63946]",
      "text-[#99131e]",
    ],
    [
      "Key missing skills",
      resume.keymissingSkills,
      "border-[#457b9d]",
      "text-[#1d3557]",
    ],
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="mt-10 space-y-8"
    >
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="flex flex-col items-start justify-between gap-4 border-2 border-[#1d3557] bg-[#d7e5ee] p-5 sm:flex-row sm:items-center sm:p-6"
      >
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#e63946]">
            Resume scored
          </p>
          <p className="mt-2 text-sm text-[#457b9d]">
            Want to compare another version?
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-2 border-2 border-[#1d3557] bg-[#f1faee] px-5 py-3 text-sm font-bold text-[#1d3557] transition-colors hover:bg-white"
          onClick={onReupload}
          type="button"
        >
          <FiUploadCloud /> Re-upload resume
        </motion.button>
      </motion.div>

      <motion.section
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05, duration: 0.25 }}
        whileHover={{ y: -2, transition: { duration: 0.15 } }}
        className="flex flex-col justify-between gap-6 border-2 border-[#1d3557] bg-[#d7e5ee] p-6 sm:flex-row sm:items-center sm:p-8 shadow-[4px_4px_0_#1d3557] transition-all hover:shadow-[6px_6px_0_#1d3557]"
      >
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#e63946]">
            Suggested role
          </p>
          <h2 className="mt-3 max-w-3xl text-xl font-semibold leading-tight text-[#1d3557]">
            {resume.suggestedRoles}
          </h2>
          <p className="mt-3 text-sm text-[#457b9d]">{resume.name}</p>
        </div>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.15, type: "spring", damping: 20 }}
          className="flex h-24 w-24 shrink-0 flex-col items-center justify-center border-2 border-[#1d3557] bg-[#f1faee] shadow-[3px_3px_0_#1d3557]"
        >
          <span className="text-3xl font-black text-[#1d3557]">
            {resume.score}
          </span>
          <span className="text-xs font-bold uppercase tracking-widest text-[#457b9d]">
            Score
          </span>
        </motion.div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.25 }}
        whileHover={{ y: -2, transition: { duration: 0.15 } }}
        className="border-2 border-[#89aad8] bg-white p-6 sm:p-8 shadow-[4px_4px_0_#89aad8] transition-all hover:shadow-[6px_6px_0_#89aad8]"
      >
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#e63946]">
          Profile summary
        </p>
        <p className="mt-4 max-w-4xl text-base leading-8 text-[#37627d]">
          {resume.summary}
        </p>
        <div className="mt-7 flex flex-wrap gap-2">
          {resume.skills?.map((skill, index) => (
            <motion.span
              key={skill}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.12 + Math.min(index * 0.02, 0.3) }}
              whileHover={{ scale: 1.05 }}
              className="border border-[#a8dadc] bg-[#edf8f8] px-3 py-1.5 text-xs font-bold text-[#1d3557]"
            >
              {skill}
            </motion.span>
          ))}
        </div>
      </motion.section>

      <section className="grid gap-4 lg:grid-cols-3">
        {insightSections.map(([title, items, border, text], index) => (
          <motion.article
            key={title}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.16 + index * 0.06, duration: 0.25 }}
            whileHover={{ y: -3, transition: { duration: 0.15 } }}
            className={`border-l-4 ${border} border-y-2 border-r-2 bg-white p-6 shadow-[3px_3px_0_#c4d4eb] transition-all hover:shadow-[5px_5px_0_#1d3557]`}
          >
            <h3 className={`text-lg font-bold ${text}`}>{title}</h3>
            <ul className="mt-5 space-y-4">
              {items?.map((item) => (
                <li key={item} className="text-sm leading-6 text-[#457b9d]">
                  • {item}
                </li>
              ))}
            </ul>
          </motion.article>
        ))}
      </section>

      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.32, duration: 0.25 }}
        className="border-2 border-[#1d3557] bg-[#1d3557] p-6 text-[#f1faee] sm:p-8 shadow-[6px_6px_0_#1d3557]"
      >
        <h3 className="text-xl font-bold">
          Recommendations for your next step
        </h3>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {resume.recommendations?.map((recommendation) => (
            <p
              key={recommendation}
              className="border-l-2 border-[#a8dadc] pl-4 text-sm leading-6 text-[#d7e5ee]"
            >
              {recommendation}
            </p>
          ))}
        </div>
      </motion.section>
    </motion.div>
  );
};

export default ResumeScore;
