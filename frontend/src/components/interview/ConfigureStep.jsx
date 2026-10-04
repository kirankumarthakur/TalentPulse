import React from "react";
import { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FiCheck, FiUploadCloud } from "react-icons/fi";
import api from "../../utils/axios";
import { setResume } from "../../redux/resumeSlice.js";
import { useCredits } from "../../services/user.api.js";
import { startInterview } from "../../services/interview.api.js";

const ConfigureStep = ({ user, setUser, onClose }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { resume } = useSelector((state) => state.resume);
  const [role, setRole] = useState("");
  const [type, setType] = useState("technical");
  const [withResume, setWithResume] = useState(!!resume);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef(null);

  const uploadResume = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (file.type !== "application/pdf") {
      setError("Please upload a PDF file.");
      return;
    }

    try {
      setError("");
      setUploading(true);
      const creditResponse = await useCredits({
        credits: 10,
        action: "Upload Resume",
      });
      setUser((previousUser) => ({
        ...previousUser,
        credits: creditResponse.credits,
      }));

      const formData = new FormData();
      formData.append("resume", file);
      const response = await api.post("/api/resume/upload", formData);
      dispatch(setResume(response.data?.data));
      setWithResume(true);
    } catch (uploadError) {
      console.error("Error uploading resume:", uploadError);
      setError(
        uploadError.response?.data?.message || "Unable to upload resume.",
      );
    } finally {
      setUploading(false);
    }
  };
  const [starting, setStarting] = useState(false);

  const start = async (event) => {
    event.preventDefault();
    if (!role.trim() || starting) return;

    try {
      setError("");
      setStarting(true);
      const response = await startInterview({
        interviewType: type,
        role: role.trim(),
        withResume,
        resume: withResume ? resume : null,
      });

      if (!response?.success) {
        setError("Unable to start the interview.");
        return;
      }

      const creditResponse = await useCredits({
        credits: 10,
        action: "Start Interview",
      });
      setUser((previousUser) => ({
        ...previousUser,
        credits: creditResponse.credits,
      }));
      navigate(`/dashboard/interview/${response.interviewId}`, {
        replace: true,
      });
      onClose();
    } catch (startError) {
      console.error("Error starting interview:", startError);
      setError(
        startError.response?.data?.message || "Unable to start the interview.",
      );
    } finally {
      setStarting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#1d3557]/20 p-4 backdrop-blur-[2px] sm:p-8"
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
    >
      <section className="max-h-[90vh] w-full max-w-2xl overflow-y-auto border-2 border-[#1d3557] bg-white p-6 shadow-[10px_10px_0_#a8dadc] sm:p-10">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#e63946]">
          Interview setup
        </p>
        <h1 className="mt-3 text-3xl font-black text-[#1d3557]">
          Configure your interview.
        </h1>
        <p className="mt-3 text-sm leading-6 text-[#457b9d]">
          Choose the role and interview format before you begin.
        </p>

        <form className="mt-8 space-y-6" onSubmit={start}>
          <label className="block">
            <span className="text-sm font-bold text-[#1d3557]">Role</span>
            <input
              className="mt-2 w-full border-2 border-[#89aad8] px-4 py-3 outline-none focus:border-[#1d3557]"
              onChange={(event) => setRole(event.target.value)}
              placeholder="e.g. Frontend Developer"
              required
              type="text"
              value={role}
            />
          </label>

          <fieldset>
            <legend className="text-sm font-bold text-[#1d3557]">
              Interview type
            </legend>
            <div className="mt-2 grid gap-3 sm:grid-cols-2">
              {[
                ["technical", "Technical"],
                ["behavioral", "Behavioral"],
              ].map(([value, label]) => (
                <label
                  className={`cursor-pointer border-2 p-4 ${type === value ? "border-[#e63946] bg-[#fad7da]" : "border-[#89aad8]"}`}
                  key={value}
                >
                  <input
                    checked={type === value}
                    className="sr-only"
                    name="interviewType"
                    onChange={() => setType(value)}
                    type="radio"
                    value={value}
                  />
                  <span className="flex items-center justify-between font-bold text-[#1d3557]">
                    {label}
                    {type === value && <FiCheck className="text-[#e63946]" />}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          <div className="border-2 border-[#c4d4eb] p-4">
            <label
              className={`flex items-start gap-3 ${resume ? "cursor-pointer" : "cursor-not-allowed opacity-60"}`}
            >
              <input
                checked={withResume}
                disabled={!resume}
                onChange={(event) => setWithResume(event.target.checked)}
                type="checkbox"
              />
              <span>
                <span className="block text-sm font-bold text-[#1d3557]">
                  Use my resume
                </span>
                <span className="mt-1 block text-xs text-[#457b9d]">
                  {resume
                    ? "Use your uploaded resume to make questions more relevant."
                    : "Upload a resume to enable this option."}
                </span>
              </span>
            </label>
            <input
              accept="application/pdf"
              className="hidden"
              onChange={uploadResume}
              ref={inputRef}
              type="file"
            />
            <button
              className="mt-4 flex items-center gap-2 border-2 border-[#1d3557] px-4 py-2 text-sm font-bold text-[#1d3557] hover:bg-[#d7e5ee] disabled:opacity-50"
              disabled={uploading}
              onClick={() => inputRef.current?.click()}
              type="button"
            >
              <FiUploadCloud /> {uploading ? "Uploading..." : "Upload resume"}
            </button>
            {error && (
              <p className="mt-3 text-xs font-semibold text-[#e63946]">
                {error}
              </p>
            )}
          </div>

          <button
            className="w-full bg-[#1d3557] px-5 py-3 text-sm font-bold text-[#f1faee] hover:shadow-[4px_4px_0_#e63946] disabled:cursor-not-allowed disabled:opacity-40"
            disabled={!role.trim() || starting}
            type="submit"
          >
            {starting ? "Starting..." : "Start interview"}
          </button>
        </form>
      </section>
    </div>
  );
};

export default ConfigureStep;

/*
for this page I want a modal, that shwos somee things, but allows a couupel of things
1. it lest's the user pick a role, we'll give the option to tyep the role
second it gies the option to select intervew type, technical or behavioral
finally it gives the option to select if they want to use their resume or not, if they have a resume uploaded, if not, it should be disabled

and it should show a start interview button, that when clicked, it should send the user to the interview page, and pass the role, type and withResume as query params
if resume was not found, it should just mention and disable teh button
Now we should give option to upload a resume, (the api will be the one used previously for upload)

we need upload state, now it'll require enough coins, we'll not actively show it,
when the request is made, if the user has enough coins, it should upload the resume and update the user state with the new resume, 
if not do the same as done in other places

 */
