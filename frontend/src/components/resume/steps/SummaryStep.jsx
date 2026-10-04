import React from "react";
import ResumeField from "../ResumeField";

const SummaryStep = ({ value, onChange }) => (
  <ResumeField
    hint="Aim for 40–80 words."
    label="Professional summary"
    multiline
    onChange={onChange}
    placeholder="A concise summary of your experience, strengths, and direction."
    value={value}
  />
);

export default SummaryStep;
