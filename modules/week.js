require('../leoLibrary.js');
var mm =  require('../moduleManager.js');
var moment = require('moment');

var triggers = ['week','vecka','uke','semaine','woche','viikko','uge','toddobaadka'];
var weekExpr = new RegExp('^(' + triggers.join('|') + ')\s*$', 'i');

mm.add({
	name: 'week',
	init: function(irc){
		irc.on('chancmd', function (from, channel, command, args, target) {
			var match = command.match(weekExpr);
			if (match == null)
				return;
			var uinfo = irc.tools.parseUserinfo(from);
			var say = (msg) => {
				if (target == uinfo.nick)
					irc.send(`PRIVMSG ${channel} :${msg}`);
				else 
					irc.send(`PRIVMSG ${channel} :${target}: ${msg}`);
			}
			if(uinfo.nick == irc.connection.nick)
				return;
			var reply = match[1][0].toUpperCase() + match[1].slice(1).toLowerCase();
			say(reply + ' ' + moment().format('W'));
		});
	}
});
