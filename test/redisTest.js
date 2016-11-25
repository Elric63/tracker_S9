/**
 * TODO : Correct all unit tests
 */


var assert = require('assert'),
    client = require('fakeredis').createClient('test'),
    fctRedis = require('../app/data/databaseController');

describe('Test Peers in Redis', function () {

    beforeEach(function () {
        client.flushdb();
    });

    afterEach(function () {
        client.flushdb();
    });

    it('setPeerId should set the id socket of a peer', function(done){
        var peer = fctRedis.setPeerId('socket1', 'fileId', 7200, client);
        peer.done(function(){
            client.multi()
                .scard('fileId:peers')
                .smembers('fileId:peers')
                .dbsize()
                .exec(function (err, ids) {

                    var nomatchFound = 'The tracker was not able to find the id you are looking for';
                    if (ids.length > 0) {
                        ids[1].forEach(function (d) {
                            if (assert.equal(d, 'socket1')) {
                                done();
                            }
                        })
                    } else {
                        console.log('the fileId room is empty.');
                        done();
                    }
                });
        });
    });

/*
    it('should get id of a peer getPeerID', function(done){
        var noSocketId = fctRedis.getPeerId('fileId:peers', client);
        noSocketId.done(null, function(err){
            assert.equal(err, 'SocketId is null');
        });

        //setup the data
        client.set('fileId:peers:socketId', 'socketId');
        client.set('fileId:peers:socketId:ipaddress', JSON.stringify({ip_address : '192.168.1.3'}));

        //make sure the function gets the correct keys
        var peerIP = fctRedis.getPeerIP('fileId:peers:socketId', client);
        peerIP.done(function(ipaddress){
            assert.equal(ipaddress.socket_id, 'socketId');
            assert.equal(ipaddress.fs.ip_address, '192.168.1.3');
            done();
        });
    });


    it('should return ip addresses with getAllIP', function(done){
        var empty = fctRedis.getAllIP('fileId', client);
        empty.done(function(ipaddresses){
            assert.equal(ipaddresses.length, 0);
        });

        //set data
        client.sadd('fileId:ipaddresses', 'fileId:peers:socketId');
        client.set('fileId:peers:socketId', 'socketId');
        client.set('fileId:peers:socketId:ipaddress', JSON.stringify({ip_address: '192.168.1.3'}));
        console.log(client);
        var oneIP = fctRedis.getAllIP('fileId', client);
        oneIP.done(function(ipaddresses){
            console.log(ipaddresses.length);
            assert.equal(ipaddresses.length, 1);
            var ipaddr = ipaddresses[0];
            assert.equal(ipaddr.socket_id, 'socketId');
            assert.equal(ipaddr.fs.ip_address, '192.168.1.3');
            done();
        });
    });*/

});

