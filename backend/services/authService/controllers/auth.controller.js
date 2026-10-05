import { app } from "../configs/firebaseConfig.js";
import { getAuth } from "firebase-admin/auth";
import User from "../models/auth.model.js";
import redisClient from "../configs/redisConfig.js";

export const GoogleAuthController = async (req, res) => {
  try {
    const { token } = req.body;
    const decodedToken = await getAuth(app).verifyIdToken(token);
    let user = await User.findOne({ firebaseId: decodedToken.uid });

    if (!user) {
      user = await User.create({
        firebaseId: decodedToken.uid,
        email: decodedToken.email,
        username: decodedToken.name,
        credits: 150,
      });
    }

    const sessionId = crypto.randomUUID();
    const sessionTtlSeconds =
      24 * 60 * 60 + Math.floor(Math.random() * 60 * 60);
    await redisClient.setex(
      `session:${sessionId}`,
      sessionTtlSeconds,
      JSON.stringify({
        userId: user._id,
        email: user.email,
        username: user.username,
        credits: user.credits,
      }),
    );

    res.cookie("session", sessionId, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: sessionTtlSeconds * 1000,
    });

    return res
      .status(200)
      .json({ message: "User authenticated successfully", user });
  } catch (error) {
    console.error("Error in GoogleAuthController:", error);
    res.status(500).json({ message: "Authentication Service error" });
  }
};

export const LogoutController = async (req, res) => {
  try {
    const sessionId = req.cookies?.session;
    if (!sessionId) {
      await redisClient.del(`session:${sessionId}`);
    }
    res.clearCookie("session", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
    return res
      .status(200)
      .json({ success: true, message: "User logged out successfully" });
  } catch (error) {
    console.error("Error in LogoutController:", error);
    res.status(500).json({ message: "Logout Service error" });
  }
};

export const useCredits = async (req, res) => {
  try {
    const sessionId = req.cookies?.session;
    if (!sessionId) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No session cookie" });
    }
    const session = await redisClient.get(`session:${sessionId}`);
    const sessionData = JSON.parse(session);
    const { credits, action } = req.body;

    if (!credits) {
      return res
        .status(400)
        .json({ success: false, message: "Bad Request: No credits specified" });
    }

    if (credits <= 0) {
      return res.status(400).json({
        success: false,
        message: "Bad Request: Credits must be positive",
      });
    }

    const user = await User.findById(sessionData.userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (user.credits < credits) {
      return res.status(400).json({
        success: false,
        message: "Insufficient credits",
        credits: user.credits,
      });
    }

    user.credits -= credits;
    await user.save();

    const randomttl = 24 * 60 * 60 + Math.floor(Math.random() * 60 * 60);

    await redisClient.setex(
      `session:${sessionId}`,
      randomttl,
      JSON.stringify({
        userId: user._id,
        email: user.email,
        username: user.username,
        credits: user.credits,
      }),
    );

    return res.status(200).json({
      success: true,
      message: `Successfully used ${credits} credits for ${action}`,
      action: action,
      credits: user.credits,
    });
  } catch (error) {
    console.error("Error in useCredits:", error);
    res.status(500).json({ message: "Use Credits Service error" });
  }
};

export const addCredits = async (req, res) => {
  try {
    const sessionId = req.cookies?.session;
    if (!sessionId) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No session cookie" });
    }
    const session = await redisClient.get(`session:${sessionId}`);
    const sessionData = JSON.parse(session);
    const { credits } = req.body;

    if (!credits) {
      return res
        .status(400)
        .json({ success: false, message: "Bad Request: No credits specified" });
    }

    if (credits <= 0) {
      return res.status(400).json({
        success: false,
        message: "Bad Request: Credits must be positive",
      });
    }

    const user = await User.findById(sessionData.userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    user.credits += credits;
    await user.save();

    const randomttl = 24 * 60 * 60 + Math.floor(Math.random() * 60 * 60);

    await redisClient.setex(
      `session:${sessionId}`,
      randomttl,
      JSON.stringify({
        userId: user._id,
        email: user.email,
        username: user.username,
        credits: user.credits,
      }),
    );

    return res.status(200).json({
      success: true,
      message: `Successfully added ${credits} credits`,
      credits: user.credits,
    });
  } catch (error) {
    console.error("Error in addCredits:", error);
    res.status(500).json({ message: "Add Credits Service error" });
  }
};
