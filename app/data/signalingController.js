var socketio = require('socket.io');
var Peer = require('./databaseController');
var  expire = 7200;

module.exports = init_sockets;

function init_sockets(server, cli) {
    var listener = socketio.listen(server);
    var clientMap = {};

    /*listener.on('connection', function (sock) {
        console.log('New peer connected with id :' + sock.id + 'and address IP :' + sock.handshake.address);
        sock.emit('message', 'Peer connecté');
        sock.on('message', function (lemessage) {
            console.log(lemessage);
        });
    });*/

    var peers = listener.of('/peers').on('connection', function (socket) {
        var peer;
        console.log('New peer connected with id :' + socket.id + 'and address IP :' + socket.handshake.address);


        function serverError(err, message) {
            console.log(err);
            socket.emit('serverError', {message: message});
        };


        //rest of our code here
        //TODO : disconnect peer "socket.on('remove'...)", and get peer IP "socket.on('get'...)

        /* add function : when  a new peer join a room */

        socket.on('signalingHandshake', function (data) {


            if(data === "v1.0"){
                socket.emit('signalingHandshakeAnswer', 'OK');
            } else {
                socket.emit('signalingHandshakeAnswer', 'DENY');
            }
            console.log(data);

        });


        socket.on('signalingRequestFile', function (data) {
            peer = new Peer(socket.id, data);

            Peer.setPeerId(JSON.stringify(socket.id), data, cli)
                .done(function () {
                    socket.join(data);

                }, function (err) {
                    serverError(err, 'Something went wrong when adding your peer!');
                });

            if (peer !== undefined) {
                //var file_id = peer.file_id;
                console.log(socket.id);
                Peer.getPeerId(data, cli).done(function (getId) {
                    socket.emit('signalingRequestFileAnswer', peerId);
                }, function (err) {
                    serverError(err, 'Something went wrong when disconnecting');
                })
            } else {
                serverError('Peer is not connected', 'Something went wrong when disconnecting')
            }
        });


        // Disconnecting useless peers
        socket.on('disconnect', function () {
            if (peer !== undefined) {
                socket.leave(peer.file_id);
                Peer.removePeer(peer.id_peer, peer.file_id, cli).done(null, function (err) {
                    serverError(err, 'Something went wrong when leaving');
                });
            }
            peer = null;
            console.log("peer removed successfully");
        });


        socket.on('rtcHandshake', function (inputStr) {
            var input = JSON.parse(inputStr);
            if (input.inst == 'init') {
                console.log("Initialisation done for " + thisIDCounter);
                clientMap[input.id] = socket;
            } else if (input.inst == 'send') {
                console.log("Send done for " + thisIDCounter);
                clientMap[input.peerId].send(JSON.stringify(input.message));
            }
        });
    });


};
