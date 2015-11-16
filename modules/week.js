require('../leoLibrary.js');
var mm =  require('../moduleManager.js');
var moment = require('moment');

var triggers = ['week','vecka','uke','semaine','woche','viikko','uge','toddobaadka'];
var weekExpr = new RegExp('^!(' + triggers.join('|') + ')\s*$', 'i');

mm.add({
	name: 'week',
	init: function(){
		// LeoTho => #leotho: hej
		var me = this;
		this.on('message', function (from, to, message) {
			if(from == me.irc.opt.nick)
				return;
			message = message.trim();
			var match = message.match(weekExpr);
			if(match == null)
				return;
			var reply = match[1][0].toUpperCase() + match[1].slice(1).toLowerCase();
			me.irc.say(to, reply + ' ' + moment().format('w'));
		});
	}
});
