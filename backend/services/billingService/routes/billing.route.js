import express from "express";
import {
  createPaymentOrder,
  verifyPayment,
  getPlans,
} from "../controllers/billing.controller.js";

const billingRouter = express.Router();

billingRouter.get("/plans", getPlans);
billingRouter.post("/create", createPaymentOrder);
billingRouter.post("/verify", verifyPayment);

export default billingRouter;
