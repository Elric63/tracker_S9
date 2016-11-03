/* Config file to configure javascript object with the values of our environment variables. */

require('./env.js'); //personal file to set local environment variables

var config = {
    REDISURL: getEnv('REDISURL'),
    PORT: getEnv('PORT'),
    PORT_TRACKER: getEnv('PORT_TRACKER')
};

function getEnv(variable){
    if (process.env[variable] === undefined){
        throw new Error('You must create an environment variable for ' + variable);
    }

    return process.env[variable];
}

module.exports = config;

