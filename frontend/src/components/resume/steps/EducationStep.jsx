import React from "react";
import ResumeEntryList from "../ResumeEntryList";

const emptyEducation = () => ({
  degree: "", institution: "", location: "", startDate: "", endDate: "", score: "",
});
const fields = Object.keys(emptyEducation());

const EducationStep = ({ items = [], onChange, onAdd, onRemove }) => (
  <ResumeEntryList
    title="Education"
    items={items}
    fields={fields}
    labels={["Degree", "Institution", "Location", "Start date", "End date", "Score / GPA"]}
    placeholders={["B.E. Computer Science", "University name", "City, Country", "2022", "2026", "8.4 / 10"]}
    requiredFields={["degree", "institution"]}
    dateFields={["startDate", "endDate"]}
    onAdd={() => onAdd(emptyEducation())}
    onChange={onChange}
    onRemove={onRemove}
  />
);

export default EducationStep;
