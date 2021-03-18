const redis = require('redis');

const redisClient = redis.createClient(process.env.redisPort);

redisClient.on('error', (error) => {
  console.error(error);
});

redisClient.on('connect', () => {
  console.log('Connected to redis');
});

module.exports = redisClient;
