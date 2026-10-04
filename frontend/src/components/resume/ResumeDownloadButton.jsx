import React, { useState } from "react";
import { pdf } from "@react-pdf/renderer";
import { FiDownload } from "react-icons/fi";
import { useCredits } from "../../services/user.api";
import EngineeringResumePdf from "./EngineeringResumePdf";

const ResumeDownloadButton = ({ data, setUser, className, label = "Download PDF" }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleDownload = async () => {
    if (loading) return;

    try {
      setError("");
      setLoading(true);
      const creditResponse = await useCredits({
        credits: 10,
        action: "Download Resume",
      });

      setUser((previousUser) => ({
        ...previousUser,
        credits: creditResponse.credits,
      }));

      const blob = await pdf(<EngineeringResumePdf data={data} />).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${data.name || "resume"}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (downloadError) {
      console.error("Error downloading resume:", downloadError);
      setError(downloadError.response?.data?.message || "Unable to download resume.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        className={className}
        disabled={loading}
        onClick={handleDownload}
        type="button"
      >
        <FiDownload />
        {loading ? "Preparing..." : label}
      </button>
      {error && <p className="mt-2 text-right text-xs font-semibold text-[#e63946]">{error}</p>}
    </>
  );
};

export default ResumeDownloadButton;
