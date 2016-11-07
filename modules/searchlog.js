var mm =  require('../moduleManager.js');
require('../leoLibrary.js')
var http = require('http');
mm.add({
	name: 'searchlog',
	init: function(irc){
		// LeoTho => #leotho: hej
		irc.on('chanmsg', function (from, to, message) {
			var uinfo = irc.tools.parseUserinfo(from);
			var toSave = {
				nick: uinfo.nick,
				message: message,
			};
			if(message.startsWith('!search'))
				return;
			var toSaveString = JSON.stringify(toSave);
			var headers = {
				'Content-Type': 'application/json; charset=utf-8'
			//	'Content-Length': toSaveString.length
				
			};
			var channel = to.substring(1);
			var options = {
				host: 'localhost',
				port: 9200,
				path: '/irc/' + channel,
				method: 'POST',
				headers: headers
			};
			var req = http.request(options, function(res) {
				res.on('data', function(data){
				//	console.log(arguments);
				});
			});
			req.on('error', function(e) {
				console.log('searchlog: ' + e);
			});
			req.write(toSaveString);
			req.end();
		});
	},
});
