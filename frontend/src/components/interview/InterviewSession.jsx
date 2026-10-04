import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import maleAi from "../../assets/male-ai.mp4";
import femaleAi from "../../assets/female-ai.mp4";
import { submitInterviewAnswer } from "../../services/interview.api";
import AnswerWorkspace from "./AnswerWorkspace";
import InterviewHeader from "./InterviewHeader";
import InterviewerPanel from "./InterviewerPanel";

const getInterviewerPersona = (interviewId) => {
  const hash = String(interviewId || "")
    .split("")
    .reduce((t, c) => t + c.charCodeAt(0), 0);

  return hash % 2 === 0
    ? { video: maleAi, voiceGender: "male" }
    : { video: femaleAi, voiceGender: "female" };
};

const speakText = (text, gender, onEnd) => {
  if (typeof window === "undefined" || !window.speechSynthesis) {
    onEnd?.();
    return;
  }

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  const voices = window.speechSynthesis.getVoices();

  if (gender === "female") {
    utterance.voice =
      voices.find((v) =>
        /female|zira|samantha|woman|jenny|aria|ava/i.test(v.name),
      ) || null;

    utterance.pitch = 1.15;
  } else {
    utterance.voice =
      voices.find(
        (v) => /david|mark|guy|male/i.test(v.name) && !/female/i.test(v.name),
      ) || null;

    utterance.pitch = 0.95;
  }

  utterance.onend = () => onEnd?.();
  utterance.onerror = () => onEnd?.();

  window.speechSynthesis.speak(utterance);
};

const InterviewSession = ({ interviewData }) => {
  const navigate = useNavigate();

  const videoRef = useRef(null);
  const recognitionRef = useRef(null);
  const autoSubmittedRef = useRef(false);

  const [questionIndex, setQuestionIndex] = useState(
    interviewData.currentQuestionIndex || 0,
  );

  const [transcript, setTranscript] = useState("");
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [mode, setMode] = useState("notes");
  const [seconds, setSeconds] = useState(90);
  const [listening, setListening] = useState(false);
  const [cameraOn, setCameraOn] = useState(false);
  const [error, setError] = useState("");
  const [isDictating, setIsDictating] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [feedbackInfo, setFeedbackInfo] = useState(null);
  const [feedbackCompleted, setFeedbackCompleted] = useState(false);

  const [interviewerPersona] = useState(() =>
    getInterviewerPersona(interviewData.interviewId),
  );

  const question = interviewData.questionBank?.[questionIndex];

  const totalQuestions =
    interviewData.totalQuestions || interviewData.questionBank?.length || 0;

  useEffect(() => {
    return () => {
      recognitionRef.current?.stop();

      videoRef.current?.srcObject?.getTracks().forEach((track) => track.stop());

      window.speechSynthesis?.cancel();
    };
  }, []);

  // Read the question when it changes
  useEffect(() => {
    if (!question) return;

    const duration = question.questionTimer || 90;

    setSeconds(duration);
    setTranscript("");
    setCode("");
    setError("");
    setFeedbackInfo(null);
    setFeedbackCompleted(false);
    setIsDictating(true);
    setSubmitting(false);

    // Reset the auto-submit guard for the new question.
    autoSubmittedRef.current = false;

    const spokenText =
      questionIndex === 0
        ? `Let's begin. ${question.questionDescription}`
        : `Next question. ${question.questionDescription}`;

    let isCancelled = false;

    speakText(spokenText, interviewerPersona.voiceGender, () => {
      if (!isCancelled) {
        setIsDictating(false);
      }
    });

    return () => {
      isCancelled = true;
      window.speechSynthesis?.cancel();
    };
  }, [
    questionIndex,
    question?.questionDescription,
    interviewerPersona.voiceGender,
  ]);

  // Count down while the candidate answers
  useEffect(() => {
    if (isDictating || submitting || feedbackInfo || seconds <= 0) return;

    const timer = setInterval(() => {
      setSeconds((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [isDictating, submitting, feedbackInfo, seconds]);

  // Submit only once when the timer expires.
  useEffect(() => {
    if (
      !isDictating &&
      !submitting &&
      !feedbackInfo &&
      seconds === 0 &&
      !autoSubmittedRef.current
    ) {
      autoSubmittedRef.current = true;
      submitAnswer();
    }
  }, [seconds, isDictating, submitting, feedbackInfo]);

  // Let the candidate start answering immediately
  const startAnswering = () => {
    if (isDictating) {
      window.speechSynthesis?.cancel();
      setIsDictating(false);
    }
  };

  const submitAnswer = async () => {
    if (submitting || feedbackInfo) return;

    setSubmitting(true);
    setError("");

    recognitionRef.current?.stop();
    setListening(false);

    window.speechSynthesis?.cancel();

    const trimmedTranscript = transcript.trim();
    const trimmedCode = code.trim();

    let answer = "";

    if (trimmedTranscript && trimmedCode) {
      answer = trimmedTranscript + "\n\n```code\n" + trimmedCode + "\n```";
    } else if (trimmedCode) {
      answer = "```code\n" + trimmedCode + "\n```";
    } else if (trimmedTranscript) {
      answer = trimmedTranscript;
    } else {
      answer = "No answer provided.";
    }

    try {
      const response = await submitInterviewAnswer(
        interviewData.interviewId,
        answer,
      );

      if (!response?.success) {
        setError(
          response?.message || "Failed to submit answer. Please try again.",
        );

        setSubmitting(false);
        return;
      }

      const fb =
        response.feedback ||
        response.interviewSession?.questionBank?.[questionIndex]?.feedback ||
        null;

      const feedbackText =
        typeof fb === "string" ? fb : fb?.feedback || "Thanks. Let's continue.";

      setFeedbackInfo(fb || { feedback: feedbackText });
      setFeedbackCompleted(Boolean(response.completed));
      setSubmitting(false);

      speakText(feedbackText, interviewerPersona.voiceGender);
    } catch (err) {
      console.error("Error submitting answer:", err);

      setError(
        "An error occurred while submitting your answer. Please try again.",
      );

      setSubmitting(false);
    }
  };

  const handleNextQuestion = () => {
    window.speechSynthesis?.cancel();

    if (feedbackCompleted || questionIndex + 1 >= totalQuestions) {
      navigate(`/dashboard/interview/${interviewData.interviewId}/report`, {
        replace: true,
      });
    } else {
      setQuestionIndex((prev) => prev + 1);
    }
  };

  const toggleMic = () => {
    if (isDictating) {
      startAnswering();
    }

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setError("Speech recognition is not available in this browser.");
      return;
    }

    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event) => {
      setTranscript(
        Array.from(event.results)
          .map((result) => result[0].transcript)
          .join(" "),
      );
    };

    recognition.onend = () => setListening(false);

    recognition.onerror = () => {
      setListening(false);
      setError("Microphone transcription encountered an issue.");
    };

    recognitionRef.current = recognition;

    recognition.start();
    setListening(true);
  };

  const toggleCamera = async () => {
    if (cameraOn) {
      videoRef.current?.srcObject?.getTracks().forEach((track) => track.stop());

      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }

      setCameraOn(false);
      return;
    }

    try {
      if (!videoRef.current) return;

      videoRef.current.srcObject = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });

      setCameraOn(true);
    } catch (cameraError) {
      console.error("Unable to access camera:", cameraError);
      setError("Camera access was not granted.");
    }
  };

  if (!question) {
    return (
      <p className="text-[#e63946]">No interview question is available.</p>
    );
  }

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25 }}
      className="min-h-[calc(100vh-2rem)]"
    >
      <InterviewHeader
        seconds={seconds}
        isDictating={isDictating}
        submitting={submitting}
        feedbackInfo={feedbackInfo}
      />

      <div className="grid gap-8 lg:grid-cols-[480px_minmax(0,1fr)]">
        <InterviewerPanel
          aiVideo={interviewerPersona.video}
          cameraOn={cameraOn}
          listening={listening}
          onCameraToggle={toggleCamera}
          onMicToggle={toggleMic}
          videoRef={videoRef}
          micDisabled={isDictating}
        />

        <AnswerWorkspace
          code={code}
          language={language}
          mode={mode}
          onCodeChange={(newCode) => {
            if (isDictating) startAnswering();
            setCode(newCode);
          }}
          onLanguageChange={setLanguage}
          onModeChange={setMode}
          onSubmit={submitAnswer}
          onTranscriptChange={(newTranscript) => {
            if (isDictating) startAnswering();
            setTranscript(newTranscript);
          }}
          question={question.questionDescription}
          isDictating={isDictating}
          submitting={submitting}
          transcript={transcript}
          isFirstQuestion={questionIndex === 0}
          feedbackInfo={feedbackInfo}
          feedbackCompleted={feedbackCompleted}
          onStartAnswering={startAnswering}
          onNextQuestion={handleNextQuestion}
        />
      </div>

      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-4 text-sm font-semibold text-[#e63946]"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </motion.main>
  );
};

export default InterviewSession;
