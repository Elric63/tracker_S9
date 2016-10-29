var socketio = require('socket.io');
var Peer = require('./peer');

module.exports = init_sockets;

function init_sockets(server, cli){
    var listener = socketio.listen(server);

    var peers = listener.of('/peers').on('connection', function(socket){
        var peer;

        //rest of our code here
        //TODO : add a new peer and disconnect "socket.on('add'...)"
    })
}