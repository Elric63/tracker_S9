/**
 * File that define the peer user going to the tracker
 */

module.exports = function Peer(id_peer, ip_address, socket_id){
    this.id_peer = id_peer;
    this.ip_address = ip_address;
    this.socket_id = socket_id;
};

