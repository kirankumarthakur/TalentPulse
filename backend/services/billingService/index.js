import dotenv from "dotenv";
import express from "express";
import { connectToDatabase } from "./configs/dbConfig.js";
import billingRouter from "./routes/billing.route.js";

dotenv.config();
const port = process.env.PORT || 5555;

const app = express();

app.use(express.json());
app.use("/", billingRouter);
app.use("/api/billing", billingRouter);

app.listen(port, () => {
  console.log(`billingService is running on port ${port}`);
  connectToDatabase();
});
