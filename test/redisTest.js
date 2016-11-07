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


    it('setPeerId should set the id socket of the peer', function(done){
        var user = fctRedis.setPeerId('idSocket', 'idFile', 7200, client);
        user.done(function(){
            client.get('idFile:peers:idSocket', function(e, d){
                assert.equal(d, 'idSocket');
                done();
            });
        });
    });


    it('setPeerIP should set IP of a peer', function(done){
        var user = fctRedis.setPeerIP('idSocket', 'idFile','192.168.1.3', 7200, client);
        user.done(function(){
            client.get('idFile:peers:idSocket:192.168.1.3', function(e, d){
                assert.equal(d, '192.168.1.3');
                done();
            });
        });
    });

});

