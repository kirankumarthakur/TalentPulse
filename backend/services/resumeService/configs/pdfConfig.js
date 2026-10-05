import fs from "fs";
import { CanvasFactory } from "pdf-parse/worker";
import { PDFParse } from "pdf-parse";

const extractTextFromPDF = async (input) => {
  const buffer = Buffer.isBuffer(input) ? input : fs.readFileSync(input);
  const pdfData = new PDFParse({
    data: buffer,
    CanvasFactory,
  });

  const result = await pdfData.getText();
  return result.text;
};

export default extractTextFromPDF;