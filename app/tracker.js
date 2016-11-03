var client = require('../app/redis');
var config = require('../config');
var express = require('express');


var tracker = express();
tracker.set('port', config.PORT);

/* Setting the tracker server */

console.log(tracker.get('port'));

/*0
var trackServer = tracker.listen(tracker.get('port'), function(){
    console.log('The Express tracker server is currently listening on port :' + trackServer.address().port

    );
    serveur redis qui ecoute 6379
    serveur express qui écoute sur 6378 sert pour les requetes http
    serveur express pour gérer le redis
    serveur express pour 

});
*/

client.on('connect', function () {
    console.log('connected');

    client.set('monhash', 'Mon Message', function (err, reply) {
        console.log(reply);
    });
});




