require('../leoLibrary.js');
var mm =  require('../moduleManager.js');
var Curl = require('node-libcurl').Curl
var HtmlEntities = require('html-entities').AllHtmlEntities;

mm.add({
	name: 'haddock',
	init: function(irc){
		var htmlDecoder = new HtmlEntities();
		irc.on('chancmd:haddock', function (from, channel, message, target) {
			var uinfo = irc.tools.parseUserinfo(from);
			var say = (msg) => {
				if (uinfo.nick == target) {
					irc.send(`PRIVMSG ${channel} :${msg}`);
				else
					irc.send(`PRIVMSG ${channel} :${target}: ${msg}`);
				}
			};
			if(uinfo.nick == irc.connection.nick)
				return;
			var curl = new Curl();
			curl.setOpt('FOLLOWLOCATION', true );
			curl.setOpt('URL', "https://haddock.updog.se/");
			curl.on( 'end', function( statusCode, body, headers ) {
				var haddockMatch = /<h1 class="title">([\s\S]+?)<\/h1>/gi.exec(body);
				if(haddockMatch == null){
					return
				}
				var haddock = htmlDecoder.decode(haddockMatch[1]);
				say(haddock);

			});
			curl.on('error', function(){curl.close();});
			curl.perform();
		});
	}
});
