import { createClient } from 'redis';

export const conectRedis = createClient({
  url: process.env.REDIS_URL,
});
