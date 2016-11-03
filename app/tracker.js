var client = require('../app/redis');
var config = require('../config');
var express = require('express');
var socket = require('../app/data/socket');
var server = require('http').Server(express);
var socketio = require('socket.io')(server);

server.listen(6377);


var tracker = express();
tracker.set('port', config.PORT_TRACKER);

/* Setting the tracker server */

console.log(tracker.get('port'));


var trackServer = tracker.listen(tracker.get('port'), function(){
    console.log('The Express tracker server is currently listening on port :' + trackServer.address().port

    );
});


socketio.on('connection', function(sockettest){
    console.log(sockettest.id);
});

client.on('connect', function () {
    console.log('connected');


    client.set('monhash', 'Mon Message', function (err, reply) {
        console.log(reply);
    });
});





