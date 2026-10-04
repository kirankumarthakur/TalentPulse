import React from "react";
import { motion } from "motion/react";
import { FiMic, FiMicOff, FiVideo, FiVideoOff } from "react-icons/fi";

const InterviewerPanel = ({
  aiVideo,
  cameraOn,
  videoRef,
  listening,
  onMicToggle,
  onCameraToggle,
  micDisabled,
}) => (
  <aside className="space-y-4">
    <motion.section
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
      className="overflow-hidden border-2 border-[#1d3557] bg-[#d7e5ee] shadow-[4px_4px_0_#1d3557]"
    >
      <video
        autoPlay
        className="aspect-video w-full object-cover"
        loop
        muted
        playsInline
        src={aiVideo}
      />
    </motion.section>
    <section className="relative overflow-hidden border-2 border-[#1d3557] bg-[#172b46] shadow-[4px_4px_0_#1d3557]">
      <video
        autoPlay
        className={`aspect-video w-full object-cover ${cameraOn ? "" : "hidden"}`}
        muted
        playsInline
        ref={videoRef}
      />
      {!cameraOn && (
        <div className="flex aspect-video items-center justify-center text-[#a8dadc]">
          <FiVideoOff size={28} />
        </div>
      )}
    </section>
    <div className="flex gap-2">
      <motion.button
        whileHover={{ scale: micDisabled ? 1 : 1.02 }}
        whileTap={{ scale: micDisabled ? 1 : 0.98 }}
        disabled={micDisabled}
        className={`flex flex-1 items-center justify-center gap-2 border-2 px-3 py-2 text-sm font-bold transition-all ${
          micDisabled
            ? "border-[#89aad8] text-[#89aad8] opacity-50 cursor-not-allowed"
            : listening
            ? "border-[#e63946] text-[#e63946] bg-[#fad7da]"
            : "border-[#1d3557] text-[#1d3557] hover:bg-[#d7e5ee]"
        }`}
        onClick={onMicToggle}
        type="button"
        title={
          micDisabled
            ? "Microphone unlocks once you start answering"
            : "Toggle microphone"
        }
      >
        {listening ? <FiMic /> : <FiMicOff />} Mic
      </motion.button>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="flex flex-1 items-center justify-center gap-2 border-2 border-[#1d3557] px-3 py-2 text-sm font-bold text-[#1d3557] hover:bg-[#d7e5ee] transition-all"
        onClick={onCameraToggle}
        type="button"
      >
        {cameraOn ? <FiVideo /> : <FiVideoOff />} Camera
      </motion.button>
    </div>
  </aside>
);

export default InterviewerPanel;
