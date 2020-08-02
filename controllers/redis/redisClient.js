const redis = require('redis')
const url = require('url')
// const redisURL = url.parse(process.env.REDISCLOUD_URL)

// const REDIS_PORT = redisURL.port || 6379
// const REDIS_HOSTNAME = redisURL.hostname || '127.0.0.1'

const client = redis.createClient(process.env.REDISCLOUD_URL || 6379, { no_ready_check: true })

// const client = redis.createClient(REDIS_PORT)
// client.auth(redisURL.auth.split(':')[1] || null)

// const client = redis.createClient(process.env.REDISCLOUD_URL, { no_ready_check: true })
module.exports = client
