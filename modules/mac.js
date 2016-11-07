require('../leoLibrary.js');
var mm =  require('../moduleManager.js');
var Curl = require('node-libcurl').Curl
var HtmlEntities = require('html-entities').AllHtmlEntities;

mm.add({
	name: 'mac',
	init: function(irc){
		var htmlDecoder = new HtmlEntities();
		irc.on('chancmd:mac', function (from, channel, args, target) {
			var uinfo = irc.tools.parseUserinfo(from);
			if(uinfo.nick == irc.connection.nick)
				return;
			var say = (msg) => {
				if (uinfo.nick == target) {
					irc.send(`PRIVMSG ${channel} :${msg}`);
					else
					irc.send(`PRIVMSG ${channel} :${target}: ${msg}`);
				}
			};	
			var vendor = '';
			var curl = new Curl();
			url = "http://api.macvendors.com/" + htmlDecoder.encode(args.trim());
			curl.setOpt('FOLLOWLOCATION', true );
			curl.setOpt('URL', url);
			curl.on( 'end', function( statusCode, body, headers ) {
				vendor = htmlDecoder.decode(body);
				if ( vendor == "")
					return;
				say(from + ': ' + vendor);
			});
			curl.on('error', function(){curl.close();});
			curl.perform();
		});
	}
});
