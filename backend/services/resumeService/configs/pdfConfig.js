import fs from "fs";
import { CanvasFactory } from "pdf-parse/worker";
import { PDFParse } from "pdf-parse";

const extractTextFromPDF = async (filepath) => {
  const buffer = fs.readFileSync(filepath);
  const pdfData = new PDFParse({
    data: buffer,
    CanvasFactory,
  });

  const result = await pdfData.getText();
  return result.text;
};

export default extractTextFromPDF;