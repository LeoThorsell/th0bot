require('../leoLibrary.js');
var http = require('../http.js');
var mm =  require('../moduleManager.js');
var commandTriggerExpr = /^!kebab(fredag)?/;
var questionTriggerExpr = /^[äe]re?\s+(det?\s+)?kebabfredag\?[?!\s]*$/i;
var kebabApiUrl = "http://ere.kebabfredag.nu/api/";

 mm.add({
	name: 'kebabfredag',
	init: function() {
		var irc = this.irc;
		irc.on('message', (from, to, message) => {
			if(from == irc.opt.nick)
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
						irc.say(to, from + ': ' + response);
					}
				});
		});
	}
});
