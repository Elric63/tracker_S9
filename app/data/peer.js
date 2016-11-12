/**
 *
 * DATABASE Controller
 *
 *
 * TODO : getPeerIP and remove
 *
 * File that define the peer user going to the tracker
 */


// 'q' is a Promise library (allow an asynchronous execution of our function)
var q = require('q');

module.exports = function Peer(socket_id, ip_address, file_id, port){
    this.port = port;
    this.ip_address = ip_address;
    this.socket_id = socket_id;
    this.file_id = file_id;
};

module.exports.setPeerId = setPeerId;
module.exports.setPeerIP = setPeerIP;

/**
 * function to set a peer in the redis db
 * using "multi" function of redis with a transaction block.
 *
 */

function setPeerId(socket_id, file_id, expire, client){
    return q.Promise(function(resolve, reject, notify){
        client.multi()

            .setex(file_id+' :peers: ' + socket_id, expire, socket_id)
            .sadd(file_id + ' :peers', file_id + ' :peers : ' + socket_id)
            .expire(file_id+' :peers', expire)
            .exec(function(err){
                if(err === null){
                    resolve();
                } else {
                    reject(err);
                }
            })
    });

};

/**
 * https://blogs.msdn.microsoft.com/cdndevs/2015/06/01/learning-redis-part-5-redis-via-node-js-and-python/
 *
 * Maybe an other way to get the IP address of the client.
 * with module('http') we can get it with : 'req.connection.remoteAddress'
 *
 */


function setPeerIP(id_peer, file_id, ip_address, expire, client){
    return q.Promise(function(resolve, reject, notify){
        client.multi()
            .setex(file_id+' :peers: ' + id_peer + ' :ipaddress', expire, ip_address)
            .sadd(file_id + ' :ipaddresses', file_id + ' :peers : ' + id_peer)
            .expire(file_id+' :ipaddresses', expire)
            .exec(function(err){
                if(err === null){
                    resolve();
                } else {
                    reject(err);
                }
            })
    });

};
