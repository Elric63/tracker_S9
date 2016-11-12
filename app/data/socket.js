var socketio = require('socket.io');
var Peer = require('./peer');

module.exports = init_sockets;

function init_sockets(server, cli){
    var listener = socketio.listen(server);

    listener.on('connection', function(sock){
        console.log('New peer connected with id :' + sock.id + 'and address IP :' + sock.handshake.address);
        sock.emit('message', 'Peer connecté');
        sock.on('message', function(lemessage){
           console.log(lemessage);
        });
    });

    var peers = listener.of('/peers').on('connection', function(socket) {
        var peer;


        //rest of our code here
        //TODO : disconnect peer "socket.on('remove'...)", and get peer IP "socket.on('get'...)

        /* add function : when  a new peer join a room */

        socket.on('add', function (id_peer, ip_address, file_id, ack) {
            peer = new Peer(socket.id, socket.handshake.address, file_id, port);

            Peer.setPeerId(socket.id, file_id, expire * 2, cli)
                .done(function () {
                    socket.join(file_id);
                    ack();
                }, function (err) {
                    serverError(err, 'Something went wrong when adding your user!');
                });
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
        });
        // use setPeerId and setPeerIP

    });
};
