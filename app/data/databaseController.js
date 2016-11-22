/**
 *
 * DATABASE Controller
 *
 *
 =======
 * TODO : Test getPeerIP and remove
 *
 * File that define the peer user going to the tracker
 */


// 'q' is a Promise library (allow an asynchronous execution of our function)
var q = require('q');

module.exports = function Peer(socket_id, file_id){
    //this.port = port;
    this.socket_id = socket_id;
    this.file_id = file_id;
    //this.ip_address = ip_address;
};

module.exports.setPeerId = setPeerId;
module.exports.getPeerId = getPeerId;
module.exports.removePeer = removePeer;
/**
 * function to set a peer in the redis db
 * using "multi" function of redis with a transaction block.
 *
 */
function setPeerId(socket_id, file_id, client){
    return q.Promise(function(resolve, reject, notify){
        client.multi()
            .set(file_id,'peers')
            .sadd(file_id+':peers', socket_id)
            .exec(function(err){
                if(err === null){
                    resolve();
                }else{
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



// recuperer les données de redis : get
function getPeerId(key, client) {
    return q.Promise(function (resolve, reject, notify) {
        client.multi()
            .scard(key+':peers')
            .smembers(key+'peers', function (err, peerIds) {
                if (err)
                    reject(err);
                if (peerIds.length() > 0) {
                    var length = peerIds.length();
                    console.log(length);
                    var returnPeerId = [];
                    peerIds.forEach(function(reply, index){
                        returnPeerId.push(reply.toString());
                        console.log("Peer " + index + ": " + reply.toString());
                        length--;
                        if(length === 0){
                            resolve(returnPeerId);
                        }
                    })
                } else {
                    resolve([]);
                }
            })
    });
};


// suppression des donnees de redis
function removePeer(socket_id, file_id, client) {
    return q.Promise(function (resolve, reject, notify) {
        client.srem(file_id + ':peers',socket_id, function (err) {
            if (err)
                reject(err);
            resolve();
        });
        console.log("peer removed successfully");
    });
};
