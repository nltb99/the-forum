const redis = require('redis'),
    url = require('url'),
    client = redis.createClient(process.env.REDISCLOUD_URL || 6379, { no_ready_check: true });

module.exports = client;
