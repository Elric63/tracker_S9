// Serveur super chat


var http = require('express')(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    ent = require('ent');
var fs = require('fs');


// Chargement du fichier index.html affiché au client
app.get('/', function (req, res) {
    res.sendfile(__dirname + './clienttest.html');
});

// Quand un client se connecte, on le note dans la console
io.sockets.on('connection', function (socket, pseudo) {
    socket.on('new_client', function (pseudo) {
        pseudo = ent.encode(pseudo);
        socket.pseudo = pseudo;
        socket.broadcast.emit('new_client', pseudo);
    });

    socket.on('message', function (message) {
        message = ent.encode(mesage);
        socket.broadcast.emit('message', {pseudo: socket.pseudo, message: message});
    });
});

server.listen(8080);
