/*var mongo = require('mongodb');
 
// Хост и порт 
var host = 'localhost';
var port = 27017;
 
//var db = new mongo.Db('nmp', new mongo.Server(host, port, {}), {});
var db = new mongo.Db('mc', new mongo.Server(host, port, {}), {safe:false});
db.open(function(err, db) {
    console.log("Connected!");
    // db.close();
});
*/

/*var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/mc');


module.exports = mongoose;*/


//var path     = require('path');
var fs      = require('fs');


var storage_list = require("./storages/storage_list.json");

function Storages() {
  // свойства всех объектов эт ого класса
  //bot = 'global bot';
  // свойства конкретного объекта
}

// свойства в прототипе (доступны всем объектам эт ого класса)

Storages.prototype.list = storage_list;

// методы в прототипе
Storages.prototype.create = function(name,type,data) {
	if( storage_list.hasOwnProperty(name) ){
		console.log("Storages.create: storage <"+name+"> already exists.");
		return;
	}
	if( type == "dir"){
		storage_list[name] = {
			"type": type,
			"path": "./storages/"+name,
			"dir": "./lib/storages/storages/"+name
		}
		fs.mkdir(storage_list[name].dir, 0755, function(err){
			if(err){
				console.log("Storages.create: unable create dir <"+storage_list[name].dir+">");
				return;
			}
			console.log("Storages.create: create dir <"+storage_list[name].dir+">");
		});
		save(name,data);
		save("storage_list",storage_list);
	}else if( type == "file"){
		storage_list[name] = {
			"type": type,
			"path": "./storages/"+name+".json",
			"dir": "./lib/storages/storages/"+name+".json"
		}
		save(name,data);
		save("storage_list",storage_list);
	}else{
		console.log("Storages.create: unknow type <"+type+">.");
		return;
	}
};

var save = Storages.prototype.save = function(name,data) {
	if( !storage_list.hasOwnProperty(name) ){
		console.log("Storages.create: storage <"+name+"> is epsent.");
		return;
	}
	if( !(typeof data === "object") ){
		console.log("Storages.save: <data> must be object");
		return;
	}
	if( storage_list[name].type == "file" ){
		var str = JSON.stringify(data,"",'\t');
		fs.writeFile(storage_list[name].dir, str, function (err) {
			if (err){
				console.log("Storages.save: unable create file <"+storage_list[name].dir+">");
				return;
			}
			console.log("Storages.save: create file <"+storage_list[name].dir+">");
		});
	}else if( storage_list[name].type == "dir" ){
		for(var key in data){
			var str = JSON.stringify(data[key],"",'\t');
			fs.writeFile(storage_list[name].dir+"/"+key+".json", str, function (err) {
				if (err){
					console.log("Storages.save: unable create file <"+storage_list[name].dir+"/"+key+".json>");
					return;
				}
			});
			console.log("Storages.save: create file <"+storage_list[name].dir+"/"+key+".json>");
		}
	}
};

Storages.prototype.open = function(name) {
	if( !storage_list.hasOwnProperty(name) ){
		console.log("Storages.create: storage <"+name+"> is epsent.");
		return {};
	}

	if( storage_list[name].type == "file" ){
		var out = require(storage_list[name].path);
		return out;
	}

	if( storage_list[name].type == "dir" ){
		var out = {}
		var files = fs.readdirSync(storage_list[name].dir);
		for(var file in files){
			var key = file;
			key.replace(/\.json$/, "");
			out[key] = require(storage_list[name].path+"/"+file);
		}
		return out;
	}

	return {};
};



// создаем и возвращаем объект от класа Commands
var storages = new Storages;

module.exports = storages;
