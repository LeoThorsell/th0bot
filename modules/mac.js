require('../leoLibrary.js');
var mm =  require('../moduleManager.js');
var Curl = require('node-libcurl').Curl
var HtmlEntities = require('html-entities').AllHtmlEntities;

mm.add({
	name: 'mac',
	init: function(irc){
		var htmlDecoder = new HtmlEntities();
		irc.on('chancmd:mac', function (from, channel, args, target, respond) {
			var uinfo = irc.tools.parseUserinfo(from);
			if(uinfo.nick == irc.connection.nick)
				return;
			console.log('Looking up mac...');
			var vendor = '';
			var curl = new Curl();
			url = "http://api.macvendors.com/" + htmlDecoder.encode(args.trim());
			curl.setOpt('FOLLOWLOCATION', true );
			curl.setOpt('URL', url);
			curl.on( 'end', function( statusCode, body, headers ) {
				console.log('mac result: ' + body);
				vendor = htmlDecoder.decode(body);
				if ( vendor == "")
					return;
				respond(`from: ${vendor}`);
			});
			curl.on('error', function(e){ console.log('error looking up mac', e); curl.close();});
			curl.perform();
		});
	}
});
