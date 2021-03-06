var color = require('ansi-color').set;
var colors = new Array();
colors["black"] = 'black+white_bg';
colors["dark_blue"] = 'blue';
colors["dark_green"] = 'green';
colors["dark_aqua"] = 'cyan'
colors["dark_red"] = 'red'
colors["dark_purple"] = 'magenta'
colors["gold"] = 'yellow'
colors["gray"] = 'black+white_bg'
colors["dark_gray"] = 'black+white_bg'
colors["blue"] = 'blue'
colors["green"] = 'green'
colors["aqua"] = 'cyan'
colors["red"] = 'red'
colors["light_purple"] = 'magenta'
colors["yellow"] = 'yellow'
colors["white"] = 'white'
colors["obfuscated"] = 'blink'
colors["bold"] = 'bold'
colors["strikethrough"] = ''
colors["underlined"] = 'underlined'
colors["italic"] = ''
colors["reset"] = 'white+black_bg'

var dictionary = {};
dictionary["chat.stream.emote"] = "(%s) * %s %s";
dictionary["chat.stream.text"] = "(%s) <%s> %s";
dictionary["chat.type.achievement"] = "%s has just earned the achievement %s";
dictionary["chat.type.admin"] = "[%s: %s]";
dictionary["chat.type.announcement"] = "[%s] %s";
dictionary["chat.type.emote"] = "* %s %s";
dictionary["chat.type.text"] = "<%s> %s";

function parseChat(chatObj, parentState) {
  function getColorize(parentState) {
    var myColor = "";
    if('color' in parentState) myColor += colors[parentState.color] + "+";
    if(parentState.bold) myColor += "bold+";
    if(parentState.underlined) myColor += "underline+";
    if(parentState.obfuscated) myColor += "obfuscated+";
    if(myColor.length > 0) myColor = myColor.slice(0, -1);
    return myColor;
  }

  if(typeof chatObj === "string") {
    return color(chatObj, getColorize(parentState));
  } else {
    var chat = "";
    if('color' in chatObj) parentState.color = chatObj['color'];
    if('bold' in chatObj) parentState.bold = chatObj['bold'];
    if('italic' in chatObj) parentState.italic = chatObj['italic'];
    if('underlined' in chatObj) parentState.underlined = chatObj['underlined'];
    if('strikethrough' in chatObj) parentState.strikethrough = chatObj['strikethrough'];
    if('obfuscated' in chatObj) parentState.obfuscated = chatObj['obfuscated'];

    if('text' in chatObj) {
      chat += color(chatObj.text, getColorize(parentState));
    } else if('translate' in chatObj && dictionary.hasOwnProperty(chatObj.translate)) {
      var args = [dictionary[chatObj.translate]];
      chatObj['with'].forEach(function(s) {
        args.push(parseChat(s, parentState));
      });

      chat += color(util.format.apply(this, args), getColorize(parentState));
    }
    for(var i in chatObj.extra) {
      chat += parseChat(chatObj.extra[i], parentState);
    }
    return chat;
  }
}

function broadcast(server, message, client) {
  var translate = client.username ? 'chat.type.announcement' : 'chat.type.text';
  var username = 'Server';

  var msg = {
    translate: translate,
    "with": [
      username,
      message
    ]
  };
  client.write('chat', {message: JSON.stringify(msg)});
}

function say_to(client, param){
          var msg = {
            translate: param.translate,
            "with": [
              param.from,
              param.message
            ]
          };
          client.write('chat', {message: JSON.stringify(msg), position: 0});
};


module.exports.say_to = say_to;
module.exports.broadcast = broadcast;
module.exports.parseChat = parseChat;