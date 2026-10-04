import React from "react";
import ResumeField from "../ResumeField";

const fields = [
  ["name", "Full name", "John Doe", true],
  ["email", "Email address", "you@example.com", true],
  ["mobile", "Mobile number", "+1 555 000 0000"],
  ["location", "Location", "City, Country"],
  ["linkedin", "LinkedIn URL", "linkedin.com/in/you"],
  ["portfolio", "Portfolio URL", "yourportfolio.com"],
  ["website", "Personal website", "example.com"],
  ["github", "GitHub URL", "github.com/you"],
];

const PersonalInformationStep = ({ data, onChange }) => (
  <div className="grid gap-5 sm:grid-cols-2">
    {fields.map(([key, label, placeholder, required]) => (
      <ResumeField
        key={key}
        label={label}
        onChange={(value) => onChange(key, value)}
        placeholder={placeholder}
        required={required}
        value={data[key]}
      />
    ))}
  </div>
);

export default PersonalInformationStep;
