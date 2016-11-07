require('../leoLibrary.js');
var mm = require('../moduleManager.js');

mm.add({
	name: 'pull',
	init: function(irc){
		var me = this;
		irc.on('chancmd:pull' , function (from, channel, args, target, respond) {
			var uinfo = irc.tools.parseUserinfo(from);
			if(uinfo.nick == irc.connection.nick)
				return;
			if(args.startsWith('pork')){
				respond(`I pulled that pork and served it to a dork!`);
				return;
			}
			if(args.startsWith('finger')){
				respond(`You sure you want to do that?`);
				respond(`                 prrrpt.`);
				return;
			}
			respond(`${irc.connection.nick} tar gärna imot pull requests. Titta här: https://github.com/LeoThorsell/th0bot/`);
			return
		});
	}
});
