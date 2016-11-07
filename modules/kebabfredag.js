require('../leoLibrary.js');
var http = require('../http.js');
var mm =  require('../moduleManager.js');
var commandTriggerExpr = /^!kebab(fredag)?/;
var questionTriggerExpr = /^[äe]re?\s+(det?\s+)?kebabfredag\?[?!\s]*$/i;
var kebabApiUrl = "http://ere.kebabfredag.nu/api/";

mm.add({
	name: 'kebabfredag',
	init: function(irc) {
		irc.on('chanmsg', (from, channel, message) => {
			var uinfo = irc.tools.parseUserinfo(from);
			if(uinfo.nick == irc.connection.nick)
				return;
			message = message.trim();
			if(!commandTriggerExpr.test(message) && !questionTriggerExpr.test(message))
				return;
			var url = kebabApiUrl + "ere";
			http
				.get(url, {headers:{'Accept':'application/json'}})
				.then((res) => {
					var data;
					try {
						data = JSON.parse(res.body);
					} catch (e) {
						console.log('Lol ere.kebabfredag.nu\'s api är trasigt!', e);
						return;
					}
					if (data && data.hasOwnProperty('answer')) {
						var response = data.answer ? 'Jepp, det är kebabfredag.' : 'Nepp, inte kebabfredag idag :(';
						irc.send(`PRIVMSG ${channel} :${uinfo.nick}: ${response}`);
					}
				});
		});
	}
});
