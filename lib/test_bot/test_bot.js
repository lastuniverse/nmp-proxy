//var mc_chat = require('mc_chat');

function botCreate(mc, states, param){
  var client = mc.createClient({
    username: param.username ? param.username : 'bot',
    host: param.host ? param.host : '127.0.0.1',
    port: param.port ? param.port : 25565
  });

  client.on('connect', function() {
    console.info('bot <'+client.username+'> connected');
  });

/*  client.on('chat', function(packet) {
    var jsonMsg = JSON.parse(packet.message);
    if(jsonMsg.translate == 'chat.type.announcement' || jsonMsg.translate == 'chat.type.text') {
      var username = jsonMsg.with[0];
      var msg = jsonMsg.with[1];
      if(username === client.username) return;
      //client.write('chat', {message: msg});
    }
  });
*/
  client.on('command', function(command) {
    client.write('chat', {message: command});
  });

  return client;
}

function fillBotCreate(param){
  var options = {
    username: param.username ? param.username : 'bot',
    host: param.host ? param.host : '127.0.0.1',
    port: param.port ? param.port : 25565
  }
  var client = mc.createClient(options);

  client.on('connect', function() {
    console.info('fill bot <'+client.username+'> connected to: ' + options.host + ":" + options.port);
  });

/*  client.on('chat', function(packet) {
    var jsonMsg = JSON.parse(packet.message);
    if(jsonMsg.translate == 'chat.type.announcement' || jsonMsg.translate == 'chat.type.text') {
      var username = jsonMsg.with[0];
      var msg = jsonMsg.with[1];
      if(username === client.username) return;
      //client.write('chat', {message: msg});
    }
  });
*/
  return client;
}

module.exports.botCreate = botCreate;
module.exports.fillBotCreate = fillBotCreate;