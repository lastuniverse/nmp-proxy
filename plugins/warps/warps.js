var commands = require('../../lib/commands');
var mc_chat = require('../../lib/mc_chat');

var warplist = require('./warplist.json');

function Warps() {

}



// свойства в прототипе (доступны всем объектам эт ого класса)
// Commands.prototype.bot = 'prototype bot';

// слушатель команды /warp
    var warpListener = function(client, command) {
      //var username = client.username;
      if( 1 in command ){
        if( warplist.hasOwnProperty(command[1]) ){
          var warp = warplist[command[1]];
          var botcommand = "/tp "+client.username+" "+warp.x+" "+warp.y+" "+warp.z+" "+warp.ry+" "+warp.rx
          commands.exec(client.ext.servername, botcommand);

        }else{
          mc_chat.say_to(client, {
            translate: 'chat.type.announcement',
            from: 'Server',
            message: 'варп ' + command[1] + ' не существует!'
          });
        }
      }else{
        var list = Object.keys(warplist).join(', ');
        mc_chat.say_to(client, {
          translate: 'chat.type.announcement',
          from: 'Server',
          message: list
        });          
      }
    };

// слушатель команды /spawn
var spawnListener = function(client, command) {
  var warp = warplist["spawn"];
  var botcommand = "/tp "+client.username+" "+warp.x+" "+warp.y+" "+warp.z+" "+warp.ry+" "+warp.rx
  commands.exec(client.ext.servername,botcommand);
};

// слушатель команды /tp
var tpListener = function(client, command) {
  var botcommand = command.join(" ");
  commands.exec(client.ext.servername,botcommand);
};


// методы в прототипе
Warps.prototype.init = function() {
  commands.add("/warp", warpListener);
  commands.add("/spawn", spawnListener);
  commands.add("/tp", tpListener);
  
};

var warps = new Warps();
warps.init();

var create = function() {
  return warps;
};
