/**
 * TODO : Test setPeerId and setPeerIP
 *
 * File that define the peer user going to the tracker
 */


// 'q' is a Promise library (allow an asynchronous execution of our function)
var q = require('q');

module.exports = function Peer(id_peer, ip_address, room, socket_id){
    this.id_peer = id_peer;
    this.ip_address = ip_address;
    this.socket_id = socket_id;
    this.room = room;
};

/**
 * function to set a peer in the redis db
 * using "multi" function of redis with a transaction block.
 *
 */

function setPeerId(id_peer, room, expire, client){
    return q.Promise(function(resolve, reject, notify){
        client.multi()
            .setex(room+' :peers: ' + id_peer, expire, id_peer)
            .sadd(room + ' :peers', room + ' :peers : ' + id_peer)
            .expire(room+' :peers', expire)
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


function setPeerIP(id_peer, room, ip_address, expire, client){
    return q.Promise(function(resolve, reject, notify){
        client.multi()
            .setex(room+' :peers: ' + id_peer + ' :ipaddress', expire, ip_address)
            .sadd(room + ' :ipaddresses', room + ' :peers : ' + id_peer)
            .expire(room+' :ipaddresses', expire)
            .exec(function(err){
                if(err === null){
                    resolve();
                } else {
                    reject(err);
                }
            })
    });

};
