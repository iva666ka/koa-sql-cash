const redis = require('redis');
const util = require('util');
const { redisHost } = require('../config/config.js').config;

const client = redis.createClient(
  { host: redisHost },
);

client.on('error', (err) => {
  console.log('Redis error: ', err);
});

client.hmset = util.promisify(client.hmset);
client.hgetall = util.promisify(client.hgetall);
client.del = util.promisify(client.del);

module.exports = {
  redisClient: client,
};
