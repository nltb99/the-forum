const redis = require('redis')
const url = require('url')
const client = redis.createClient(process.env.REDISCLOUD_URL || 6379, { no_ready_check: true })

module.exports = client
