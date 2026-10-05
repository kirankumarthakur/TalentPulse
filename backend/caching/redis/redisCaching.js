import redis from "ioredis";

const redisClient = new redis({
  port: process.env.REDIS_PORT,
  host: process.env.REDIS_HOST,
  username: process.env.REDIS_USERNAME,
  password: process.env.REDIS_PASSWORD,
});

redisClient.on("connect", () => {
  console.log("Connected to Redis successfully");
});

export default redisClient;
