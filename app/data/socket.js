var socketio = require('socket.io');
var Peer = require('./peer');

module.exports = init_sockets;

function init_sockets(server, cli){
    var listener = socketio.listen(server);

    listener.on('connection', function(sock){
        console.log(sock.id);
    });

    var peers = listener.of('/peers').on('connection', function(socket){
        var peer;


        //rest of our code here
        //TODO : add a new peer and disconnect "socket.on('add'...)"

        /* add function : when  a new peer join a room */

        socket.on('add', function(id_peer, ip_address, room, ack){
            peer = new Peer(id_peer, ip_address, room, socket.id);

            // use setPeerId and setPeerIP

        })
    })
}