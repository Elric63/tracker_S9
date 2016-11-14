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

module.exports = function Peer(socket_id, file_id, ip_address){
    //this.port = port;
    this.socket_id = socket_id;
    this.file_id = file_id;
    this.ip_address = ip_address;
};

module.exports.setPeerId = setPeerId;
module.exports.setPeerIP = setPeerIP;
module.exports.getPeerIP = getPeerIP;
module.exports.getAllIP = getAllIP;
module.exports.removePeer = removePeer;
/**
 * function to set a peer in the redis db
 * using "multi" function of redis with a transaction block.
 *
 */
function setPeerId(socket_id, file_id, expire, client){
    return q.Promise(function(resolve, reject, notify){
        client.multi()
            .setex(file_id+':peers:' + socket_id, expire, socket_id)
            .sadd(file_id+':peers', file_id+':peers:' + socket_id)
            .expire(file_id+':peers', expire)
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

function setPeerIP(socket_id, file_id, ip_address, expire, client) {
    return q.Promise(function (resolve, reject, notify) {
        client.multi()
            .setex(file_id + ':peers:' + socket_id + ':ipaddress', expire, ip_address)
            .sadd(file_id + ':ipaddresses', file_id + ':peers:' + socket_id)
            .expire(file_id + ':ipaddresses', expire)
            .exec(function (err) {
                if (err === null) {
                    resolve();
                } else {
                    reject(err);
                }
            });
    });
};

// recuperer les données de redis : get
function getPeerIP(ipaddress, client) {
    return q.Promise(function (resolve, reject, notify) {
        client.get(ipaddress, function (err, socketId) {
            if (err)
                reject(err);
            if(socketId === null)
                reject('SocketId is null');

        client.get(ipaddress + ':ipaddress', function (err, ip_address) {
            if (err)
                reject(err);
            if (ip_address === null)
                reject('ip address does not exist');
            resolve({socket_id: socketId, fs: JSON.parse(ip_address)});
        })
        });
    });
};

function getAllIP(file_id, client) {
    return q.Promise(function (resolve, reject, notify) {
        client.smembers(file_id + 'ipaddresses', function (err, ipaddr) {
            if (err)
                reject(err);
            if (ipaddr.length > 0) {
                var length = ipaddr.length;
                var returnIPAddresses = [];
                IPaddresses.forEach(function (ip_address) {
                    getPeerIP(ip_address, client).done(function (ip_address) {
                        returnIPAddresses.push(ip_address);
                        length--;
                        if (length === 0)
                            resolve(returnIPAddresses);
                    }, function (err) {
                        reject(err);
                    });
                });
            } else {
                resolve([]);
            }
        });
    });
};
// suppression des donnees de redis
function removePeer(socket_id, file_id, client) {
    return q.Promise(function (resolve, reject, notify) {
        client.srem(file_id + ':peers', file_id + ':peers:' + socket_id, function (err) {
            if (err)
                reject(err);
            resolve();
        });
    });
};
