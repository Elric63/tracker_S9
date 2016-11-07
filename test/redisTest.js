var assert = require('assert'),
    client = require('fakeredis').createClient('test'),
    repo = require('../app/data/peer');

describe('Repository Test', function () {

    beforeEach(function () {
        client.flushdb();
    });

    afterEach(function () {
        client.flushdb();
    });

});

