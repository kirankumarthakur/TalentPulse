import fs from "fs";
import { PDFParse } from "pdf-parse";

const extractTextFromPDF = async (filepath) => {
  const buffer = fs.readFileSync(filepath);
  const pdfData = new PDFParse({
    data: buffer,
  });

  const result = await pdfData.getText();
  return result.text;
};

export default extractTextFromPDF;