// var db = require('../../lib/storages');
// // Хост и порт 


// var User = db.model('User', {name: String, roles: Array, age: Number});
// var user1 = new User({name: 'test 1', roles: ['admin', 'moderator','premium', 'vip', 'user']});
// user1.name = user1.name.toUpperCase();
// console.log(user1);
// user1.save(function (err, userObj) {
//   if (err) {
//     console.log(err);
//   } else {
//     console.log('saved successfully:', userObj);
//   }
// });

var storages = require('../../lib/storages');
/*storages.save("users",{
	"lastuniverse": {
		"server": "server_1",
		"roles": {"admin":true,"moderator":true,"premium":true,"vip":true,"user":true,"guest":true},
		"position": {x:0,y:0,z:0,yaw:0,pitch:0},
		"world": "overworld"
	}
});
*/

var user_list = {};

console.log("test Users 1");



function Users() {
  // свойства всех объектов этого класса
  //bot = 'global bot';
  // свойства конкретного объекта
  console.log("test Users 2");
}

// свойства в прототипе (доступны всем объектам эт ого класса)
Users.prototype.list = user_list;

// методы в прототипе
var save = Users.prototype.save = function(username,data) {
	storages.save("users",data);
}

Users.prototype.newuser = function(username,options) {
	var user = {
        "pos": {
        	"cur": {
	        	"x":0,
	        	"y":0,
	        	"z":0,
	        	"yaw":0,
	        	"pitch":0,
				"server": "server_1",
				"world": "overworld"
	        },
        	"old": {
	        	"x":0,
	        	"y":0,
	        	"z":0,
	        	"yaw":0,
	        	"pitch":0,
				"server": "server_1",
				"world": "overworld"
	        }
        },
		"roles": {
			"guest":true
		}
	};
	user_list[username] = user;

	var newuser = {};
	newuser[username] = user;
	save(username,newuser);
}




// создаем и возвращаем объект от класа Commands
var users = new Users;

module.exports = users;