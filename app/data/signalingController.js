var socketio = require('socket.io');
var Peer = require('./databaseController');
var  expire = 7200;

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

        var id_peer = socket.id,
            ip_address = socket.handshake.address,
            file_id = 'file1';

        socket.on('add', function (id_peer, ip_address, file_id, ack) {
            peer = new Peer(id_peer, file_id, ip_address);

            Peer.setPeerId(id_peer, file_id, expire * 2, cli)
                .done(function () {
                    socket.join(file_id);
                    ack();
                }, function (err) {
                    serverError(err, 'Something went wrong when adding your user!');
                });
        });

        socket.on('addIpAddress', function (ipaddress) {
            if(peer !== undefined){
                Peer.setPeerIP(peer.socket_id, peer.file_id, peer.ip_address, expire, cli)
                    .done(function(){
                        listener.of('/peers').in(peer.file_id).emit('ipaddress', {socket_id: peer.socket_id, ip_address: peer.ip_address});
                    }, function(err){
                        //serverError(err, 'Something went wrong when adding peer ip address!');
                    });
            }else{
                //serverError('Peer is not logged in', 'Something went wrong when adding ip address!');
            }
        });

        // Disconnecting useless peers
        socket.on('disconnect', function () {
            if (peer !== undefined) {
                socket.leave(peer.file_id);
                Peer.removePeer(peer.id_peer, peer.file_id, cli).done(null, function (err) {
                    //serverError(err, 'Something went wrong when leaving');
                });
            }
            peer = null;
        });

        // Function to get Peer IP adress from database
        socket.on('getPeerIp', function () {
            if (peer !== undefined) {
                var file_id = peer.file_id;
                Peer.getPeerIP(peer.file_id, cli).done(function (getIp) {
                    getIp.forEach(function (peerIp) {
                        socket.emit('peerIp', peerIp)
                    });
                }, function (err) {
                    //serverError(err, 'Something went wrong when disconnecting');
                })
            } else {
                //serverError('Peer is not connected', 'Something went wrong when disconnecting')
            }
        });

    });
};
