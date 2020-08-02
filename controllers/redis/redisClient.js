const redis = require('redis')
const url = require('url')
// const redisURL = url.parse(process.env.REDISCLOUD_URL)
const REDIS_PORT = process.env.REDISCLOUD_URL || 6379

const client = redis.createClient(REDIS_PORT)

// const client = redis.createClient(redisURL.port, redisURL.hostname, { no_ready_check: true })
// client.auth(redisURL.auth.split(':')[1])

module.exports = client
