import redis from "ioredis";

const redisClient = new redis({
  host: process.env.REDIS_HOST,
});

redisClient.on("connect", () => {
  console.log("Connected to Redis successfully");
});

export default redisClient;
