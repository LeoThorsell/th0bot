require('../leoLibrary.js');
var mm =  require('../moduleManager.js');
var Curl = require('node-libcurl').Curl;
var triggerExpr = /^!kebab(fredag)?/;
var kebabApiUrl = "http://ere.kebabfredag.nu/api/";

mm.add({
	name: 'kebabfredag',
	init: function() {
		var irc = this.irc;;
		this.on('message', function (from, to, message) {
			if(from == irc.opt.nick)
				return;
			message = message.trim();
			if(!triggerExpr.test(message))
				return;
			var curl = new Curl();
			var url = kebabApiUrl + "ere";
			curl.setOpt(Curl.option.FOLLOWLOCATION, true);
			curl.setOpt(Curl.option.HTTPHEADER, ['Accept: application/json']);
			curl.setOpt(Curl.option.URL, url);
			curl.on( 'end', function(statusCode, body, headers) {
				var data;
				try {
					data = JSON.parse(body);
				} catch (e) {
					console.log('Lol ere.kebabfredag.nu\'s api är trasigt!', e);
					return;
				}
				if (data && data.hasOwnProperty('answer')) {
					var response = data.answer ? 'Jepp, det är kebabfredag.' : 'Nepp, inte kebabfredag idag :(';
					irc.say(to, from + ': ' + response);
				}
			});
			curl.on('error', function(){curl.close();});
			curl.perform();
		});
	}
});
