/**
 * Created by alex on 07/11/16.
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
        ioClient.on('connect', function () {
            ioClient2.on('connect', function () {
                ioClient.emit('add', 'idSocket1','ipaddress1', 'file1', function () {
                    ioClient2.emit('add', 'idSocket2','ipaddress2', 'file1', function () {
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


    it('should add a peer with his id', function(done) {
        //the peer was created in beforeEach
        client.multi()
            .get('file1:peers:idSocket1')
            .exec(function (err, results) {
                assert.strictEqual(results[0], 'idSocket1');
                done();
            });
    });


    it('should add an ipaddress', function(done){
        ioClient.on('ipaddress', function(ipaddress){
            assert.strictEqual(ipaddress.socket_id, 'idSocket1');
            assert.strictEqual(ipaddress.ip_address, 'ipaddress1');
            done();
        });
        ioClient.emit('addIpAddress', 'ipaddress1');
    });

    // TODO : testing 'disconnect' and 'getPeerIp'

    it('should remove a peer with this id', function (done) {
        client.multi()
            .get('file1:peer:idSocket1')
            .exec(function (err, results) {
                assert.strictEqual(results[0], null);
                done();
            });
    });



});