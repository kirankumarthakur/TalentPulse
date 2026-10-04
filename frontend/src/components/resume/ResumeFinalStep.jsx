import React from "react";
import { PDFViewer } from "@react-pdf/renderer";
import EngineeringResumePdf from "./EngineeringResumePdf";

const ResumeFinalStep = ({ data }) => (
  <div className="h-[75vh] min-h-0 w-full bg-[#d7e5ee]">
    <PDFViewer className="h-full w-full border-0" showToolbar={false}>
      <EngineeringResumePdf key={JSON.stringify(data)} data={data} />
    </PDFViewer>
  </div>
);

export default ResumeFinalStep;
