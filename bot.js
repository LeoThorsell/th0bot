var irc = require('irc');
var mm = require('./moduleManager.js');

var client = new irc.Client('irc.freenode.net', 'Th0bot', {
	channels: ['#leotho', '#himat', '#daladevelop'],
	userName: 'Leos',
    	realName: 'Owned by LeoTho'
});
mm.init(client);
