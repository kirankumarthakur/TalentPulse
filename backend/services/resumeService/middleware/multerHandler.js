import multer from "multer";

const storage = multer.memoryStorage();

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