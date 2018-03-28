require('../leoLibrary.js');
var http = require('../http.js');
var mm =  require('../moduleManager.js');
var HtmlEntities = require('html-entities').AllHtmlEntities;
var ignoreUrls = ['paste.debian.net', 'pastie.org', 'jsfiddle.net', 'pastebin.com', 'imgur.com'];
mm.add({
	name: 'title',
	init: function(irc){
		var htmlDecoder = new HtmlEntities();
		// LeoTho => #leotho: hej
		var me = this;
		irc.on('chanmsg', function (from, channel, message) {
			var uinfo = irc.tools.parseUserinfo(from);
			if(uinfo.nick == irc.connection.nick)
				return;
			if(uinfo.nick == 'debuglnorinkdo')
			    return;
			var urlMatch = /(https?:\/\/[^\s]+)/.exec(message);

			if(urlMatch == null)
				return;
			for(var i=0;i<ignoreUrls.length;i++)
				if(new RegExp(ignoreUrls[i], 'i').exec(message))
					return;
			//ignore trailing period, comma and close parenthesis
			var url = urlMatch[0].replace(/[,.\)]+$/,'');
			http
				.get(url, {maxread: 1024*50})
				.then(res => {
					console.log('title:', res);
					var titleMatch = /<title[^>]*>(.*?)<\/title>/gi.exec(res.body);
					if(titleMatch == null){
						return;
					}
					var title = titleMatch[1].trim();	
					title = htmlDecoder.decode(title);
					title = title.replace(/(\r\n|\r|\n)+/g, ' ');
					if( title.length > 230 )
						title = title.substring(0,229) + "…";
					irc.send(`PRIVMSG ${channel} :title: ${title}`);
				});
		});
	}
});
