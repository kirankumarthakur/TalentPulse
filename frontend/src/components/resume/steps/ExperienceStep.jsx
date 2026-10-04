import React from "react";
import ResumeEntryList from "../ResumeEntryList";

const emptyExperience = () => ({
  role: "", company: "", type: "", location: "", startDate: "", endDate: "", description: "",
});
const fields = Object.keys(emptyExperience());

const ExperienceStep = ({ items = [], onChange, onAdd, onRemove }) => (
  <ResumeEntryList
    title="Experience"
    items={items}
    fields={fields}
    labels={["Role", "Company", "Experience type", "Location", "Start date", "End date", "Description"]}
    placeholders={["Software Engineer", "Company name", "Full-time", "City, Country", "Jan 2024", "Present", "What did you work on and what changed because of it?"]}
    requiredFields={["role", "company"]}
    dateFields={["startDate", "endDate"]}
    multilineField="description"
    onAdd={() => onAdd(emptyExperience())}
    onChange={onChange}
    onRemove={onRemove}
  />
);

export default ExperienceStep;
