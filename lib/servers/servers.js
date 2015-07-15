//sergeynk.sknt.ru
// [19:08:22] Sergey Kakurin: ssh root@sergeynk.sknt.ru
// [19:08:27] Sergey Kakurin: password: IDHXQRFQ-567wh3b7s43k

var server_list = require('./serverlist.json');



var mc = require('minecraft-protocol');
var states = mc.states;

var packet_listeners = require('../packet_listeners');
var commands = require('../../lib/commands');
var users = require('../../lib/users');

var Rcon = require('rcon');
var key = "";

function rcon_connect (key) {
	//console.log("key: ["+key+"]");
	server_list[key].current = key;
	var cur = server_list[key];
	var rcon = new Rcon(cur.host, cur.rcon.port, cur.rcon.pass, {tcp: true, challenge: false});
	
	rcon.on('auth', function() {
	console.log("rcon Authed! ["+key+"]");
	}).on('response', function(str) {
	console.log("rcon Got response: ["+key+"] " + str);
	}).on('end', function() {
	console.log("rcon Socket closed! ["+key+"]");
		//process.exit();
		rcon_connect(key);
	});
	rcon.connect();
	commands.rcon[key] = rcon;
}

for(key in server_list){
	rcon_connect(key);
}


function Servers() {
  // свойства всех объектов эт ого класса
  //bot = 'global bot';
  // свойства конкретного объекта
}

// свойства в прототипе (доступны всем объектам эт ого класса)

Servers.prototype.list = server_list;

// методы в прототипе
Servers.prototype.test = function() {

};


Servers.prototype.reconnect = function(client,servername){
	var user = users.list[client.username];
	var pos = user.pos;
	var flags = client.ext.flags;
	if( pos.cur.server == servername ) return;

	flags.reconnect = true;
	console.log("Reconnect to server ("+servername+")   1" );

	var newServer = mc.createClient({
		host: server_list[servername].host,
		port: server_list[servername].port,
		username: client.username,
		'online-mode': false
	});   

	function onLogin(packet) {
		var compressionThreshold = false;
		if(packet.state == states.PLAY && client.state == states.PLAY) {
			if (packet.id === 0x46) // Set compression
			compressionThreshold = packet.threshold;
		}
		if (	packet.id == 63 && 
				packet.state == states.PLAY && 
				!flags.reconnect_init
		){
			flags.reconnect_init = true;
			if( compressionThreshold ) 
				client.compressionThreshold = compressionThreshold;

			;
			var cmd = "/tp "+client.username+" "+pos.cur.x+" "+pos.cur.y+" "+pos.cur.z+" "+pos.cur.yaw+" "+pos.cur.pitch;

			client.ext.newservername = servername;
			servers.fill(client.ext.server);
			servers.reinit(client,newServer);

			client.ext.server.end("End");
			client.ext.server = newServer;
			client.ext.servername = servername;
			pos.old.server = pos.cur.server;
			pos.cur.server = servername;

			if(!flags.endedClient)
				client.write(packet.id, packet);
			newServer.removeListener('packet', onLogin);
			setTimeout(function () {
				console.log("TP");
				commands.exec(servername,cmd);
			},100 ); 

		}
	};
	newServer.on('packet', onLogin);

	setTimeout(function () {
		flags.reconnect = false;
		flags.reconnect_init = false;
	},5000 );      
};

Servers.prototype.reinit = function(client,tc){
	var user = users.list[client.username];
	var pos = user.pos;
	var flags = client.ext.flags;
	var servername = client.ext.newservername?client.ext.newservername:client.ext.servername;
	var wb = server_list[servername].worldborder;


var pack = {"id":68,"state":"play","action":3,"x":wb.center.x,"z":wb.center.z,"old_radius":wb.radius,"new_radius":wb.radius,"speed":100,"portalBoundary":wb.radius-2,"warning_time":5,"warning_blocks":15};
client.write(pack.id, pack);

packet_listeners.on('server_68',function(client,packet){
	client.write(pack.id, pack);
});


	tc.listeners = {};
	tc.listeners.packet = function(packet) {
		if(packet.state == states.PLAY && client.state == states.PLAY ) {
			if(!flags.endedClient){
		        var listener = "server_"+packet.id;
		        if( !packet_listeners.emit(listener,client,packet) )
					client.write(packet.id, packet);
			}
			if (packet.id === 0x46) // Set compression
				client.compressionThreshold = packet.threshold;
		}
	};
	tc.on('packet', tc.listeners.packet);

	tc.listeners.end = function() {
		flags.endedTargetClient = true;
		console.log('Connection closed by server', '(' + tc.curentServer + ')');
		if(!flags.endedClient )
			client.end("End");
	};
	tc.on('end', tc.listeners.end);

	tc.listeners.error = function() {
		flags.endedTargetClient = true;
		console.log('Connection error by server', '(' + tc.curentServer + ')');
		if(!flags.endedClient )
			client.end("Error");
	};
	tc.on('error', tc.listeners.error);
};

Servers.prototype.fill = function(tc){
	tc.removeListener('packet', tc.listeners.packet);
	tc.removeListener('end', tc.listeners.end);
	tc.removeListener('error', tc.listeners.error);
};



// создаем и возвращаем объект от класа Commands
var servers = new Servers;


var listeners_4_5_6 = function(client,packet){
	var user = users.list[client.username];
	var pos = user.pos;
	var flags = client.ext.flags;

	var key = 'empty';
	for( key in packet ){
		if( pos.cur.hasOwnProperty(key) ){
			pos.old[key] = pos.cur[key];
			pos.cur[key] = packet[key].toFixed(1);
		}
	}
	if( pos.cur.x != pos.old.x || 
		pos.cur.y != pos.old.y
	){
		change_position(client,packet);
	}
	client.ext.server.write(packet.id, packet);
}

packet_listeners.on('client_4', listeners_4_5_6 );
packet_listeners.on('client_5', listeners_4_5_6 );
packet_listeners.on('client_6', listeners_4_5_6 );


function change_position(client,packet){
	var user = users.list[client.username];
	var pos = user.pos;
	var flags = client.ext.flags;

    if( pos.cur.x<=(-102) && pos.old.x>(-102) ){
    	if(!flags.reconnect){
			servers.reconnect(client,"server_2");
		}else{
			//var cmd = "/tp "+client.username+" "+pos.old.x+" "+pos.old.y+" "+pos.old.z+" "+pos.old.yaw+" "+pos.old.pitch;
			//commands.exec(pos.cur.server,cmd);
		}
    }else if( pos.cur.x>(-98) && pos.old.x<=(-98) ){
    	if(!flags.reconnect){
			servers.reconnect(client,"server_1");
		}else{
			//var cmd = "/tp "+client.username+" "+pos.old.x+" "+pos.old.y+" "+pos.old.z+" "+pos.old.yaw+" "+pos.old.pitch;
			//commands.exec(pos.cur.server,cmd);
		}
    }
}


module.exports = servers;