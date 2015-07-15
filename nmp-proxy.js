// the basis is taken the blame file Andrew Kelley
// https://github.com/PrismarineJS/node-minecraft-protocol/blob/master/examples/proxy/proxy.js

var mc = require('minecraft-protocol');
var states = mc.states;
var util = require('util');


//var usleep = require('sleep').usleep;

// подключаю свои библиотеки
var Servers = require('./lib/servers');
var mc_chat = require('./lib/mc_chat');
var test_bot = require('./lib/test_bot');
var commands = require('./lib/commands');
var packet_listeners = require('./lib/packet_listeners');
var users = require('./lib/users');
var storages = require('./lib/storages');

// подключаю свои плагины
var warps = require('./plugins/warps');

var printAllIds = false;
var printIdWhitelist = {};
var printIdBlacklist = {};


var options = {
  'server': {
    checkTimeoutInterval: 30 * 1000,
    'online-mode': false,
    port: 25566
  },
  'client': {
    host: '127.0.0.1',
    port: 25565,
    username: 'test',
    'online-mode': false
  }
}



var srv = mc.createServer(options.server);


/*var bot1 = test_bot.botCreate(mc, states,{
    host: '127.0.0.1',
    port: 25565,
    username: 'test_bot',
    'online-mode': false
});
commands.bots["25565"] = bot1;

var bot2 = test_bot.botCreate(mc, states,{
    host: '127.0.0.1',
    port: 25564,
    username: 'test_bot',
    'online-mode': false
});
commands.bots["25564"] = bot2;*/


srv.on('login', loginOnServer);


function loginOnServer(client, port) {
  if( !users.list[client.username] )
    users.newuser(client.username,{});
  client.ext = {};
  var user = users.list[client.username];
  var flags =  {  
      "endedClient": false,
      "endedTargetClient": false
  };
  client.ext.flags = flags;
  client.ext.user = user;
  client.ext.servername =  user.pos.cur.server;

  



  var addr = client.socket.remoteAddress;
  console.log('Incoming connection', '(' + addr + ')');


  
  client.on('end', function() {
    endedClient = true;
    console.log('Connection closed by client', '(' + addr + ')');
    if(!flags.endedTargetClient )
      client.ext.server.end("End");
  });


  client.on('error', function() {
    endedClient = true;
    console.log('Connection error by client', '(' + addr + ')');
    if(!flags.endedTargetClient )
      client.ext.server.end("Error");
  });

  client.ext.server = mc.createClient({
    host: options.client.host,
    port: options.client.port,
    username: client.username,
    'online-mode': false
  });


  client.on('packet', function(packet) {
    if(client.ext.server.state == states.PLAY && packet.state == states.PLAY) {
      if(!flags.endedTargetClient){
        var listener = "client_"+packet.id;
        if( !packet_listeners.emit(listener,client,packet) )
          client.ext.server.write(packet.id, packet);
      }
    }
  });

  Servers.reinit(client, client.ext.server);

};







function shouldDump(id, direction) {
  if(matches(printIdBlacklist[id])) return false;
  if(printAllIds) return true;
  if(matches(printIdWhitelist[id])) return true;
  return false;
  function matches(result) {
    return result != null && result.indexOf(direction) !== -1;
  }
}


