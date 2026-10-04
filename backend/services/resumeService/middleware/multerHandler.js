import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const uploadPath = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../uploads",
);
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadPath);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}.pdf`);
  },
});

const isPdfFile = (file) => file?.mimetype === "application/pdf";

const fileFilter = (_req, file, cb) => {
  if (isPdfFile(file)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only PDF files are allowed."), false);
  }
};

export const upload = multer({
  storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});