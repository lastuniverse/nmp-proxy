var mc_chat = require('../mc_chat');
var servers = require('../../lib/servers');

var commandlist = {};

var bots = {};
var rcon = {};

function Commands() {
  // свойства всех объектов эт ого класса
  //bot = 'global bot';
  // свойства конкретного объекта
}

// свойства в прототипе (доступны всем объектам эт ого класса)

Commands.prototype.bots = bots;
Commands.prototype.rcon = rcon;


// свойства в прототипе (доступны всем объектам эт ого класса)
Commands.prototype.exec = function(server, param){
  //console.log("exec: ["+param+"] ["+server+"]");
  //console.log(server);
  if( rcon.hasOwnProperty(server) ){
    rcon[server].send(param);
    //console.log(' rcon: ['+param+']');
  }
};


// методы в прототипе
Commands.prototype.test = function() {

};



// добавляем обработчик команды
Commands.prototype.add = function(commandname, cb) {
  commandlist[commandname] = cb;
};

// удаляем обработчик команды
Commands.prototype.remove = function(commandname) {
  delete commandlist[commandname];
};

// запускаем обработчик команды
Commands.prototype.emit = function(client, command) {
  var username = client.username;
console.log(username+' command: ['+command+'] 0');
  if( !(typeof command == "string") ) return false;
//nsole.log(username+' command: ['+command+'] 1');
  if( !( RegExp(/^\/\S+/).test(command) ) ) return false;
//nsole.log(username+' command: ['+command+'] 2');
  var arr = command.split(/\s+/);

  if( !(0 in arr && typeof arr[0] == "string") ) return false;
//nsole.log(username+' command: ['+command+'] 3');
  if( !commandlist.hasOwnProperty(arr[0]) ) return false;
//nsole.log(username+' command: ['+command+'] 4');  
  if( !(typeof commandlist[arr[0]] == "function") ) return false;
//nsole.log(username+' command: ['+command+'] 5');
  commandlist[arr[0]](client, arr);
  return true;
};

// создаем и возвращаем объект от класа Commands
var cmd = new Commands;

module.exports = cmd;