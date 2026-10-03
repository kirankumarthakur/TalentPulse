import { app } from "../configs/firebaseConfig.js";
import { getAuth } from "firebase-admin/auth";
import User from "../models/auth.model.js";
import redisClient from "../../../caching/redis/redisCaching.js";

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
      sameSite: "strict",
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
      sameSite: "strict",
    });
    return res
      .status(200)
      .json({ success: true, message: "User logged out successfully" });
  } catch (error) {
    console.error("Error in LogoutController:", error);
    res.status(500).json({ message: "Logout Service error" });
  }
};
