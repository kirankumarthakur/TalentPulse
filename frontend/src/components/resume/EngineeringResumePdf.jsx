import React from "react";
import { Document, Link, Page, StyleSheet, Text, View } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: { backgroundColor: "#fff", color: "#243b53", fontFamily: "Helvetica", fontSize: 9, padding: 40 },
  header: { borderBottomColor: "#56a8e8", borderBottomWidth: 2, paddingBottom: 12 },
  name: { color: "#164c91", fontSize: 25, fontWeight: "bold", textTransform: "uppercase" },
  contact: { color: "#52606d", flexDirection: "row", flexWrap: "wrap", fontSize: 8, marginTop: 6 },
  contactItem: { marginRight: 12 },
  contactLabel: { color: "#164c91", fontWeight: "bold" },
  links: { color: "#164c91", flexDirection: "row", flexWrap: "wrap", fontSize: 8, marginTop: 7 },
  link: { color: "#164c91", marginRight: 4, textDecoration: "none" },
  separator: { color: "#9aa5b1", marginHorizontal: 7 },
  section: { marginTop: 18 },
  sectionTitle: { borderBottomColor: "#c4d4eb", borderBottomWidth: 1, color: "#657786", fontSize: 8, fontWeight: "bold", letterSpacing: 1.2, marginBottom: 8, paddingBottom: 3, textTransform: "uppercase" },
  entry: { marginBottom: 11 },
  entryHeader: { flexDirection: "row", justifyContent: "space-between" },
  entryTitle: { color: "#164c91", fontSize: 11, fontWeight: "bold" },
  entryMeta: { color: "#52606d", fontSize: 8, marginTop: 2 },
  entryMetaRow: { flexDirection: "row", justifyContent: "space-between" },
  body: { color: "#364152", fontSize: 9, lineHeight: 1.35, marginTop: 4 },
  bullet: { color: "#364152", fontSize: 9, lineHeight: 1.15, marginTop: 3 },
  skillLine: { color: "#364152", fontSize: 9, marginBottom: 4 },
  skillCategory: { color: "#164c91", fontWeight: "bold" },
  url: { color: "#52606d", fontSize: 8, marginTop: 2 },
  projectHeader: { alignItems: "center", flexDirection: "row", justifyContent: "space-between" },
  projectName: { alignItems: "center", flexDirection: "row" },
  projectLinks: { flexDirection: "row", marginLeft: 7 },
  projectLink: { color: "#164c91", fontSize: 7, marginRight: 5, textDecoration: "none" },
});

const ContactItem = ({ icon, label, value }) =>
  value && <Text style={styles.contactItem}><Text style={styles.contactLabel}>{icon} </Text>{label}: {value}</Text>;

const SocialLink = ({ label, value }) => <Link src={value} style={styles.link}>{label}</Link>;

const Section = ({ title, children }) => (
  <View style={styles.section}><Text style={styles.sectionTitle}>{title}</Text>{children}</View>
);

const Bullet = ({ children }) => <Text style={styles.bullet}>• {children}</Text>;

const formatMonthYear = (value) => {
  if (!value) return "";
  const [year, month] = value.split("-");
  const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  return year && month ? `${monthNames[Number(month) - 1]} ${year}` : value;
};

const dateRange = (startDate, endDate) =>
  [formatMonthYear(startDate), formatMonthYear(endDate)].filter(Boolean).join(" - ");

const EngineeringResumePdf = ({ data }) => (
  <Document title={`${data.name || "Resume"} - Engineering Resume`}>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.name}>{data.name || "Your Name"}</Text>
        <View style={styles.contact}>
          {data.mobile && <ContactItem icon="P" label="Phone" value={data.mobile} />}
          {data.email && <ContactItem icon="@" label="Email" value={data.email} />}
          {data.location && <ContactItem icon="L" label="Location" value={data.location} />}
          {(data.linkedin || data.github || data.portfolio || data.website) && (
            <>
              <Text style={styles.separator}>|</Text>
              {data.linkedin && <SocialLink label="LinkedIn" value={data.linkedin} />}
              {data.linkedin && (data.github || data.portfolio || data.website) && <Text style={styles.separator}>|</Text>}
              {data.github && <SocialLink label="GitHub" value={data.github} />}
              {data.github && (data.portfolio || data.website) && <Text style={styles.separator}>|</Text>}
              {(data.portfolio || data.website) && <SocialLink label="Portfolio" value={data.portfolio || data.website} />}
            </>
          )}
        </View>
      </View>

      {data.summary && <Section title="Summary"><Text style={styles.body}>{data.summary}</Text></Section>}

      {data.experience.length > 0 && (
        <Section title="Experience">
          {data.experience.map((entry, index) => (
            <View key={`experience-${index}`} style={styles.entry}>
              <View style={styles.entryHeader}>
                <Text style={styles.entryTitle}>{entry.role}</Text>
                <Text style={styles.entryMeta}>{dateRange(entry.startDate, entry.endDate)}</Text>
              </View>
              <View style={styles.entryMetaRow}>
                <Text style={styles.entryMeta}>
                  {[entry.company, entry.location].filter(Boolean).join("   ")}
                </Text>
                {entry.type && <Text style={styles.entryMeta}>{entry.type}</Text>}
              </View>
              {entry.description && <Bullet>{entry.description}</Bullet>}
            </View>
          ))}
        </Section>
      )}

      {data.skills.length > 0 && (
        <Section title="Technical skills">
          {data.skills.map((skill, index) => <Text key={`skill-${index}`} style={styles.skillLine}><Text style={styles.skillCategory}>{skill.category}: </Text>{skill.name}</Text>)}
        </Section>
      )}

      {data.projects.length > 0 && (
        <Section title="Projects">
          {data.projects.map((project, index) => (
            <View key={`project-${index}`} style={styles.entry}>
              <View style={styles.projectHeader}>
                <View style={styles.projectName}>
                  <Text style={styles.entryTitle}>{project.name}</Text>
                  <View style={styles.projectLinks}>
                    {project.githubLink && <Link src={project.githubLink} style={styles.projectLink}>[Github]</Link>}
                    {project.liveLink && <Link src={project.liveLink} style={styles.projectLink}>[Live]</Link>}
                  </View>
                </View>
                <Text style={styles.entryMeta}>{project.timing}</Text>
              </View>
              <Text style={styles.body}>{project.description}</Text>
            </View>
          ))}
        </Section>
      )}

      {data.education.length > 0 && (
        <Section title="Education">
          {data.education.map((entry, index) => (
            <View key={`education-${index}`} style={styles.entry}>
              <View style={styles.entryHeader}><Text style={styles.entryTitle}>{entry.degree}</Text><Text style={styles.entryMeta}>{dateRange(entry.startDate, entry.endDate)}</Text></View>
              <Text style={styles.entryMeta}>{entry.institution}</Text>
              <Text style={styles.entryMeta}>{[entry.location, entry.score].filter(Boolean).join("   ")}</Text>
            </View>
          ))}
        </Section>
      )}

      {data.certifications.length > 0 && (
        <Section title="Certifications">
          {data.certifications.map((certification, index) => (
            <View key={`certification-${index}`} style={styles.entry}>
              <Text style={styles.entryTitle}>{certification.name}</Text>
              <Text style={styles.entryMeta}>{certification.timing}</Text>
              <Text style={styles.body}>{certification.description}</Text>
              {certification.link && <Text style={styles.url}>{certification.link}</Text>}
            </View>
          ))}
        </Section>
      )}
    </Page>
  </Document>
);

export default EngineeringResumePdf;
