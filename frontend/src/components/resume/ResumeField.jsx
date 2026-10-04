import React from "react";

const ResumeField = ({
  label,
  value = "",
  onChange,
  placeholder,
  multiline = false,
  hint,
  required = false,
  type = "text",
}) => {
  const Component = multiline ? "textarea" : "input";

  return (
    <label className="block">
      <span className="text-sm font-bold text-[#1d3557]">
        {label}
        {required && <span className="ml-1 text-[#e63946]" aria-hidden="true">*</span>}
      </span>
      {hint && <span className="mt-1 block text-xs text-[#457b9d]">{hint}</span>}
      <Component
        className={`mt-2 w-full border-2 border-[#c4d4eb] bg-[#f1faee] px-3 py-3 text-sm text-[#1d3557] outline-none transition-colors placeholder:text-[#89aad8] focus:border-[#457b9d] ${
          multiline ? "min-h-32 resize-y" : ""
        }`}
        onChange={(event) => onChange(String(event.target.value))}
        placeholder={placeholder}
        required={required}
        type={multiline ? undefined : type}
        value={value}
      />
    </label>
  );
};

export default ResumeField;
