require('../leoLibrary.js');
var mm =  require('../moduleManager.js');
var moment = require('moment');

mm.add({
	name: 'week',
	init: function(){
		// LeoTho => #leotho: hej
		var me = this;
		this.on('message', function (from, to, message) {
			if(from == me.irc.opt.nick)
				return;
			message = message.trim();
			if(!message.startsWith('!week'))
				return;
			me.irc.say(to, 'Vecka ' + moment().format('w'));
		});
	}
});
