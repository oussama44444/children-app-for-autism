// redis-client.js
const redis = require('redis');

let redisClient;

async function getRedisClient() {
  if (!redisClient || !redisClient.isReady) {
    console.log('Creating new Redis client connection...');
    redisClient = redis.createClient({
      url: process.env.REDIS_URL // This will be your Vercel KV URL in production, or local Redis URL
    });

    redisClient.on('connect', () => {
      console.log('Connected to Redis!');
    });

    redisClient.on('error', (err) => {
      console.error('Redis client error:', err);
      // In a real application, you might want to implement more robust error handling
      // like retries or fallback mechanisms. For now, we'll just log.
    });

    try {
      await redisClient.connect();
    } catch (err) {
      console.error('Failed to connect to Redis:', err);
      // If connection fails, future calls will try to reconnect.
      // You might throw the error or return null to indicate failure.
      redisClient = null; // Reset client so next call attempts fresh connection
    }
  }
  return redisClient;
}

module.exports = getRedisClient;