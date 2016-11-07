/**
 * Created by alex on 07/11/16.
 */

var assert = require('assert'),
    fakeRedis = require('fakeredis'),
    http = require('http'),
    socketio = require('../app/data/socket'),
    io = require('socket.io-client');


var options ={
    transports: ['websocket'],
    'force new connection': true
};

describe('Socket.io Test', function() {
    var ioClient,
        ioClient2,
        client = fakeRedis.createClient('test'),
        server = http.createServer().listen(8000);

    socketio(server, client);

    beforeEach(function (done) {
        ioClient = io('http://localhost:' + server.address().port + '/peers', options);
        ioClient2 = io('http://localhost:' + server.address().port + '/peers', options);
        //all tests require a user created
        ioClient.on('connect', function () {
            ioClient2.on('connect', function () {
                ioClient.emit('add', 'idSocket1','ipaddress1', 'File1', function () {
                    ioClient2.emit('add', 'idSocket2','ipaddress2', 'File1', function () {
                        done();
                    });
                });
            });
        });
    });


    afterEach(function(){
        client.flushdb();
        ioClient.disconnect();
        ioClient2.disconnect();
    });



});