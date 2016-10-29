// Redis config file and creation of clients

var redis = require('redis'),
    config = require('../../config'),
    url = require('url');

// Get redis configuration to access the db and client's creation.

var redisConfig = url.parse(config.REDISURL);

console.log(config.PORT);
console.log(redisConfig.hostname);
console.log(redisConfig);

var client = redis.createClient(redisConfig.port, redisConfig.hostname);

module.exports = client;