require('../leoLibrary.js');
var http = require('../http.js');
var mm =  require('../moduleManager.js');
var HtmlEntities = require('html-entities').AllHtmlEntities;
if (typeof String.prototype.startsWith != 'function') {
	String.prototype.startsWith = function (str){
		return this.slice(0, str.length) == str;
	};
}
var ignoreUrls = ['paste.debian.net', 'pastie.org', 'jsfiddle.net', 'pastebin.com', 'imgur.com'];
mm.add({
	name: 'title',
	init: function(){
		var htmlDecoder = new HtmlEntities();
		// LeoTho => #leotho: hej
		var me = this;
		this.on('message', function (from, to, message) {
			if(me.irc == null )
				return;
			if(from == me.irc.opt.nick)
				return;
			if(from == 'debuglnorinkdo')
				return;
			var urlMatch = /(https?:\/\/[^\s]+)/.exec(message);
		
			if(urlMatch == null)
				return;
			for(var i=0;i<ignoreUrls.length;i++)
				if(new RegExp(ignoreUrls[i], 'i').exec(message))
					return;
			var url = urlMatch[0];
			http
				.get(url)
				.then(res => {
					var titleMatch = /<title[^>]*>(.*?)<\/title>/gi.exec(res.body);
					if(titleMatch == null){
						return;
					}
					var title = titleMatch[1].trim();	
					title = htmlDecoder.decode(title);
					title = title.replace(/(\r\n|\r|\n)+/g, ' ');
					if( title.length > 230 )
						title = title.substring(0,229) + "…";
					me.irc.say(to, 'title: ' + title);
				});
		});
	}
});
