var irc = require('jonirc');
var mm = require('./moduleManager.js');

var connectionAttempt = 0;
var channels = ['#callide'];


var client = irc('irc.freenode.net', 'Th0botta', {
	userName: 'Leos',
  realName: 'Owned by LeoTho'
});
client.connect();

client.on('disconnected', () => {
	setTimeout(client.connect, (Math.min(connectionAttempt++,6))*10*1000);  
});
client.on('connected', () => {
	connectionAttempt = 0;
	channels.forEach((channel) => {
		client.send(`JOIN ${channel}`);
	});
});
mm.init(client);


// backward compatibility stuff
client.say = function(target, msg) {
	client.send(`PRIVMSG ${target} :${msg}`);
}
