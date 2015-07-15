var EventEmitter = require('events').EventEmitter;

var packet_listeners = new EventEmitter;



var commands = require('../commands');

packet_listeners.on('client_1',function(client,packet){
  if( !commands.emit(client, packet.message) ){
    client.ext.server.write(packet.id, packet);
  }
});




packet_listeners.on('client_7',function(client,packet){
//     lockPacket={
//     id:35,
//     state: "play",
//     location: packet.location,
//     type: 704
//   };
//   client.write(lockPacket.id, lockPacket);
  var servername = client.ext.user.pos.cur.server
  var pos = packet.location;
  if( Math.abs(pos.x)>50 || Math.abs(pos.z)>50 ){
    var location = " " + pos.x + " " + pos.y + " " + pos.z;
    commands.exec(client.ext.servername,"/clone"+location+location+" 1 1 1");
    commands.exec(client.ext.servername,"/clone 1 1 1 1 1 1"+location);
  }else{
    client.ext.server.write(packet.id, packet);
  }
});

packet_listeners.on('client_8',function(client,packet){
            var pos = {
              x: packet.location.x,
              y: packet.location.y,
              z: packet.location.z
            };
            if( packet.direction == 0 ) pos.y--;
            if( packet.direction == 1 ) pos.y++;
            if( packet.direction == 2 ) pos.z--;
            if( packet.direction == 3 ) pos.z++;
            if( packet.direction == 4 ) pos.x--;
            if( packet.direction == 5 ) pos.x++;

            if( Math.abs(pos.x)>50 || Math.abs(pos.z)>50 ){
              //console.log(JSON.stringify(packet));
              var location = " " + pos.x + " " + pos.y + " " + pos.z;
              commands.exec(client.ext.servername,"/clone"+location+location+" 1 1 1");
              commands.exec(client.ext.servername,"/clone 1 1 1 1 1 1"+location);
            }else{
              client.ext.server.write(packet.id, packet);
            }
});


module.exports = packet_listeners;