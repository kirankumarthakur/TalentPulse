import redis from 'ioredis';

const redisClient = new redis({
  host: process.env.REDIS_HOST
});

export default redisClient;