var socketio = require('socket.io'),
    Peer = require('./peer');


/* Initialisation des sockets */

function initSockets(server, client){
    var socket = socketio.listen(server);

    var peers = socket.of('/peers').on('connection', function(socket){
        var peer;

        console.log('a new peer arrived');

    });



};