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
        var peer = fctRedis.setPeerId('socketId', 'fileId', 7200, client);
        peer.done(function(){
            client.get('fileId:peers:socketId', function(e, d){
                assert.equal(d, 'socketId');
                done();
            });
        });
    });


    it('setPeerId should set the id socket of the peer', function(done){
        var user = fctRedis.setPeerId('idSocket', 'idFile', 7200, client);
        user.done(function(){
            client.get('idFile:peers:idSocket', function(e, d){
                assert.equal(d, 'idSocket');
                done();
            });
        });
    });

    it('should set ipaddress of the peer', function(done){
        var ipaddress = fctRedis.setPeerIP('socketId', 'fileId', '192.168.1.3', 7200, client);
        ipaddress.done(function(){
            client.get('fileId:peers:socketId:ipaddress', function(e, d){
                assert.equal(d, '192.168.1.3');
                client.scard('fileId:ipaddresses', function(e, d){
                    assert.equal(d, '1');
                    done();
                });
            });
        });
    });


    it('should get ip addresses for getPeerIP', function(done){
        var noSocketId = fctRedis.getPeerIP('fileId:peers:socketId', client);
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

/*
    it('should return ip addresses with getAllIP', function(done){
        var empty = fctRedis.getAllIP('fileId', client);
        empty.done(function(ipaddresses){
            assert.equal(ipaddresses.length, 0);
        });

        //set data
        client.sadd('fileId:ipaddresses', 'fileId:peers:socketId');
        client.set('fileId:peers:socketId', 'socketId');
        client.set('fileId:peers:socketId:ipaddress', JSON.stringify({ip_address: '192.168.1.3'}));

        var oneIP = fctRedis.getAllIP('fileId', client);
            oneIP.done(function(ipaddresses){
            assert.equal(ipaddresses.length, 1);
            var ipaddr = ipaddresses[0];
            assert.equal(ipaddr.socket_id, 'socketId');
            assert.equal(ipaddr.fs.ip_address, '192.168.1.3');
            done();
        });
    });*/

});

