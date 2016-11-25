/**
 * Created by alex on 07/11/16.
 */

/**
 * TODO : Correct all unit tests
 */


var assert = require('assert'),
    fakeRedis = require('fakeredis'),
    http = require('http'),
    socketio = require('../app/data/signalingController'),
    io = require('socket.io-client');


var options ={
    transports: ['websocket'],
    'force new connection': true
};

describe('Socket.io Test', function() {
    var ioClient,
        ioClient2,
        client = fakeRedis.createClient('test'),
        server = http.createServer().listen(0);

    socketio(server, client);

    beforeEach(function (done) {
        ioClient = io('http://localhost:' + server.address().port + '/peers', options);
        ioClient2 = io('http://localhost:' + server.address().port + '/peers', options);
        //all tests require a user created
        ioClient.on('connection', function () {
            ioClient2.on('connection', function () {
                ioClient.emit('signalingHandshake', 'v1.0', function () {
                    ioClient2.emit('signalingHandshake', 'v1.0', function () {
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


    it('should check the version of MS-STREAM', function(done) {
        client.multi()
            .get('file1:peers:idSocket1')
            .exec(function (err, results) {
                assert.strictEqual(results[0], 'idSocket1');
                done();
            });
    });



});