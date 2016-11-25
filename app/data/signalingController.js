var socketio = require('socket.io');
var Peer = require('./databaseController');
var  expire = 7200;

module.exports = init_sockets;

function init_sockets(server, cli) {
    var listener = socketio.listen(server);
    var clientMap = {};

    var peers = listener.of('/peers').on('connection', function (socket) {
        var peer;

        console.log('New peer connected with id :' + socket.id + ' and address IP :' + socket.handshake.address);


        function serverError(err, message) {
            console.log(err);
            socket.emit('serverError', {message: message});
        };


        //rest of our code here

        /**
         *  Signaling handshake, Check the version used
         */

        socket.on('signalingHandshake', function (data) {


            if(data === "v1.0"){
                socket.emit('signalingHandshakeAnswer', 'OK');
            } else {
                socket.emit('signalingHandshakeAnswer', 'DENY');
            }
            console.log(data);

        });

        /**
         *
         * signaling request file to send a list of peers to the connected peer
         *
         */

        socket.on('signalingRequestFile', function (data) {
            peer = new Peer(socket.id, data, socket);

            console.log(data);

            Peer.setPeerId(socket.id, data, cli)
                .done(function () {
                    socket.join(data);

                }, function (err) {
                    serverError(err, 'Something went wrong when adding your peer!');
                });

            clientMap[peer.socket_id] = socket;

            if (peer.socket_id !== "undefined") {

                Peer.getPeerIds(data, peer.socket_id, cli).done(function (getId) {

                    var perso_sock = peer.socket_id;
                    var answer = {'peers_id':getId, 'your_id':perso_sock};

                    console.log(answer);
                    //console.log(clientMap);
                    socket.emit('signalingRequestFileAnswer', answer);

                }, function (err) {
                    serverError(err, 'Something went wrong when disconnecting');
                })
            } else {
                serverError(err, 'Something went wrong when the list of peers')
            }
        });

        socket.on('rtcHandshake', function(idPeerToConnect){
            var file = peer.file_id;
            console.log(idPeerToConnect);
            console.log(file);
            if(file !== 'undefined'){
                Peer.getPeer(file, idPeerToConnect, cli).done(function(idPeer){
                    console.log(idPeer);
                    clientMap[idPeer].emit('rtcConnectionRequest' ,JSON.stringify(peer.socket_id));
                    socket.emit('rtcHandshakeAnswer', 'OK');

                })

            } else {
                serverError(err, 'KO')
            }
        });



        // Disconnecting useless peers
        socket.on('disconnect', function () {
            if (peer.socket_id !== "undefined") {
                socket.leave(peer.file_id);
                Peer.removePeer(peer.socket_id, peer.file_id, cli).done(null, function (err) {
                    serverError(err, 'Something went wrong when leaving');
                });
            }
            //clientMap.delete(peer.socket_id);
            peer = null;
            console.log("database Controller told me that the peer was removed successfully");
        });

    });



};
