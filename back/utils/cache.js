// utils/cache.js
const getRedisClient = require('../redis-client'); // Adjust path as needed for utils folder


const invalidateCache = async (pattern) => {
    let redisClient;
    try {
        redisClient = await getRedisClient();
        if (redisClient) {
            if (pattern.includes('*')) { // Check if the key contains a wildcard
                const keys = await redisClient.keys(pattern); // Get all keys matching the pattern
                if (keys.length > 0) {
                    const deletedCount = await redisClient.del(keys); // Delete all found keys
                    console.log(`Cache invalidated for pattern: ${pattern}. Deleted ${deletedCount} keys.`);
                } else {
                    console.log(`No keys found to invalidate for pattern: ${pattern}`);
                }
            } else { // No wildcard, delete a single exact key
                await redisClient.del(pattern);
                console.log(`Cache invalidated for key: ${pattern}`);
            }
        } else {
            console.warn(`Redis client not available, unable to invalidate cache for pattern/key: ${pattern}`);
        }
    } catch (err) {
        console.error(`Error invalidating cache for pattern/key ${pattern}:`, err);
    }
};

module.exports = { invalidateCache };
module.exports = {
  invalidateCache // Export the function
};