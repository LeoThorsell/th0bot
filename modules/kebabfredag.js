require('../leoLibrary.js');
var mm =  require('../moduleManager.js');
var Curl = require('node-libcurl').Curl;
var triggerExpr = /^!kebab(fredag)?/;

mm.add({
	name: 'kebabfredag',
	init: function() {
		var me = this;
		this.on('message', function (from, to, message) {
			if(from == me.irc.opt.nick)
				return;
			message = message.trim();
			if(!triggerExpr.test(message))
				return;
			var curl = new Curl();
			url = "http://ere.kebabfredag.nu/api/ere";
			curl.setOpt(Curl.option.FOLLOWLOCATION, true);
			curl.setOpt(Curl.option.HTTPHEADER, ['Accept: application/json']);
			curl.setOpt('URL', url);
			curl.on( 'end', function(statusCode, body, headers) {
				var data = JSON.parse(body);
				if (data && data.hasOwnProperty('answer')) {
					var response = data.answer ? 'Jepp, det är kebabfredag.' : 'Nepp, inte kebabfredag idag :(';
					me.irc.say(to, from + ': ' + response);
				}
			});
			curl.on('error', function(){curl.close();});
			curl.perform();
		});
	}
});
