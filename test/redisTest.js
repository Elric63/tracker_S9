var assert = require('assert'),
    client = require('fakeredis').createClient('test'),
    fctRedis = require('../app/data/peer');

describe('Test Peers in Redis', function () {

    beforeEach(function () {
        client.flushdb();
    });

    afterEach(function () {
        client.flushdb();
    });

    it('setPeerId should set the id socket of a peer', function(done){
        var user2 = fctRedis.setPeerId('socketId', 'fileId', 7200, client);
        user2.done(function(){
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

});

