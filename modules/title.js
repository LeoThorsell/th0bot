require('../leoLibrary.js');
var mm =  require('../moduleManager.js');
var Curl = require('node-libcurl').Curl
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
			var curl = new Curl();
			curl.setOpt('FOLLOWLOCATION', true );
			curl.setOpt('URL', url);
			var chunkCount = 0;
			var text = '';
			var found = false;
			curl.on( 'data', function( chunk ) {
				if(chunkCount++>30){
					return 0;
				}
				if(found)
					return 0;
				text += chunk.toString();
				//var titleMatch = /(<\s*title[^>]*>(.+?)<\s*\/\s*title)>/gi.exec(text);
				var titleMatch = /<title.+?>([\s\S]+?)<\/title>/gi.exec(text);
				if(titleMatch == null){
					return chunk.length;
				}
				found = true;
				text = null;

				var title = titleMatch[1].replace(/(\r\n|\n|\r)/gm,'').trim();

				title = htmlDecoder.decode(title);
				title = title.replace(/(?:\r\n|\r|\n)/g, ' ');
				title = title.replace(/\s{2,}/g, ' ');
				if( title.length > 230 )
					title = title.substring(0,229) + "…";
				me.irc.say(to, 'title: ' + title);
				return chunk.length;
			});
			curl.on('end', function(){curl.close();});
			curl.on('error', function(){curl.close();});
			curl.perform();
		});
	}
});
