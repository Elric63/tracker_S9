/**
 *
 * DATABASE Controller
 *
 *
 =======
 * TODO : Unit Test getPeerID, removePeer and setPeerId
 *
 * File that define the peer user going to the tracker
 */


// 'q' is a Promise library (allow an asynchronous execution of our function)
var q = require('q');

module.exports = function Peer(socket_id, file_id, sock){
    this.socket_id = socket_id;
    this.file_id = file_id;
    this.sock = sock;
};

module.exports.setPeerId = setPeerId;
module.exports.getPeerIds = getPeerIds;
module.exports.removePeer = removePeer;
module.exports.getPeer = getPeer;
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
 *
 * @param key -> file id
 * @param client
 * @returns {Ids of peers that share the same file}
 */

function getPeerIds(key, sock_id_co, client) {

    return q.Promise(function (resolve, reject, notify) {

        client.multi()
            .scard(key+':peers')
            .smembers(key+':peers')
            .dbsize()
            .exec(function (err, peerIds) {
                if (err) {
                    reject(err);
                }

                if (peerIds[1].length > 0) {

                    var length = peerIds[1].length;
                    var returnPeerId = [];
                    peerIds[1].forEach(function(ids){

                        if(sock_id_co !== ids) {
                            returnPeerId.push(ids);
                        }
                    })
                    resolve(returnPeerId);
                } else {
                    resolve([]);
                }

            })
    });
};

function getPeer(file, id, client){

    return q.Promise(function (resolve, reject, notify) {

        client.multi()
            .scard(file+':peers')
            .smembers(file+':peers')
            .dbsize()
            .exec(function (err, ids) {
                if (err) {
                    reject(err);
                }
                var nomatchFound = 'The tracker was not able to find the id you are looking for';
                if (ids.length > 0) {

                    console.log(id);

                    ids[1].forEach(function(tracked_id){

                        if(id === tracked_id) {

                            resolve(tracked_id);
                        }
                    })
                } else {
                    resolve(nomatchFound);
                }
            })
    });

};

/**
 *
 * @param socket_id
 * @param file_id
 * @param client
 * @returns {*}
 *
 * Remove a peer when he has finished to watch a video
 *
 */

function removePeer(socket_id, file_id, client) {
    console.log("yolo");
    return q.Promise(function (resolve, reject, notify) {
        client.srem(file_id + ':peers',socket_id, function (err) {
            if (err)
                reject(err);
            console.log("peer removed successfully");
            resolve();
        });

    });
};
