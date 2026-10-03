import redisClient from "../../caching/redis/redisCaching.js";

export const authMiddleware = async (req, res, next) => {
  try {
    const sessionId = req.cookies?.session;
    if (!sessionId) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No session cookie" });
    }

    const session = await redisClient.get(`session:${sessionId}`);
    if (!session) {
      return res.status(401).json({ message: "Unauthorized: Invalid session" });
    }
    req.user = JSON.parse(session);
    next();
  } catch (error) {}
};
