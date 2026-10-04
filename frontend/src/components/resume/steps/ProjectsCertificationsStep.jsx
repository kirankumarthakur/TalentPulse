import React from "react";
import ResumeEntryList from "../ResumeEntryList";

const emptyProject = () => ({
  name: "", description: "", timing: "", liveLink: "", githubLink: "",
});
const emptyCertification = () => ({
  name: "", description: "", timing: "", link: "",
});
const projectFields = Object.keys(emptyProject());
const certificationFields = Object.keys(emptyCertification());

const ProjectsCertificationsStep = ({
  projects = [],
  certifications = [],
  onChange,
  onAdd,
  onRemove,
}) => (
  <div className="space-y-8">
    <ResumeEntryList
      title="Projects"
      items={projects}
      fields={projectFields}
      labels={["Project name", "Description", "Timing", "Live link", "GitHub link"]}
      placeholders={["Project name", "What did you build?", "2024", "example.com", "github.com/you/project"]}
      requiredFields={["name"]}
      multilineField="description"
      onAdd={() => onAdd("projects", emptyProject())}
      onChange={(index, field, value) => onChange("projects", index, field, value)}
      onRemove={(index) => onRemove("projects", index)}
    />
    <ResumeEntryList
      title="Certifications"
      items={certifications}
      fields={certificationFields}
      labels={["Certification name", "Description", "Timing", "Credential link"]}
      placeholders={["Certification name", "What did this cover?", "2024", "credential.example.com"]}
      requiredFields={["name"]}
      multilineField="description"
      onAdd={() => onAdd("certifications", emptyCertification())}
      onChange={(index, field, value) => onChange("certifications", index, field, value)}
      onRemove={(index) => onRemove("certifications", index)}
    />
  </div>
);

export default ProjectsCertificationsStep;
