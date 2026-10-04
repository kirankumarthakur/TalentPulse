import crypto from "crypto";
import razorpayInstance from "../configs/razorpayConfig.js";
import plans from "./plans.js";
import Billing from "../models/billing.model.js";

export const getPlans = (req, res) => {
  return res.status(200).json({
    success: true,
    plans,
  });
};

export const createPaymentOrder = async (req, res) => {
  try {
    const { planId } = req.body;
    if (!planId) {
      return res
        .status(400)
        .json({ success: false, message: "Bad Request: No planId specified" });
    }

    const userId = req.headers["x-user-id"];
    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "Bad Request: No userId specified" });
    }

    const plan = await plans[planId];
    if (!plan) {
      return res
        .status(400)
        .json({ success: false, message: "Bad Request: Invalid plan" });
    }

    const amount = plan.credits;

    const order = await razorpayInstance.orders.create({
      amount: amount * 100,
      currency: "INR",
      receipt: `receipt_${userId}_${Date.now()}`,
    });

    await Billing.create({
      userId,
      amount: amount,
      creditsPurchased: plan.credits,
      razorpayOrderId: order.id,
      status: "pending",
    });

    return res.status(200).json({
      success: true,
      message: "Payment order created successfully",
      order,
      amount: order.amount,
      currency: order.currency,
      credits: plan.credits,
    });
  } catch (error) {
    console.error("Error creating payment order:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Bad Request: Missing required payment details",
      });
    }

    const payment = await Billing.findOne({
      razorpayOrderId: razorpay_order_id,
    });
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment record not found for the given order ID",
      });
    }

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      payment.status = "failed";
      await payment.save();
      return res.status(400).json({
        success: false,
        message: "Bad Request: Invalid payment signature",
      });
    }

    if (payment.status === "completed") {
      return res.status(400).json({
        success: false,
        message: "Payment has already been verified and completed",
      });
    }

    payment.status = "completed";
    payment.razorpayPaymentId = razorpay_payment_id;
    payment.razorpaySignature = razorpay_signature;
    await payment.save();

    return res.status(200).json({
      success: true,
      message: "Payment verified and completed successfully",
    });
  } catch (error) {
    console.error("Error verifying payment:", error);

    if (req.body.razorpay_order_id) {
      const payment = await Billing.findOneAndUpdate(
        { razorpayOrderId: req.body.razorpay_order_id },
        { status: "failed" },
      );
    }

    return res
      .status(500)
      .json({ success: false, message: "Payment Verification Failed" });
  }
};
