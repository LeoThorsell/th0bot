require('../leoLibrary.js');
var mm =  require('../moduleManager.js');
var Curl = require('node-libcurl').Curl
var HtmlEntities = require('html-entities').AllHtmlEntities;

//if (typeof String.prototype.startsWith != 'function') {
//	String.prototype.startsWith = function (str){
//		return this.slice(0, str.length) == str;
//	};
//}
mm.add({
	name: 'mac',
	init: function(){
		var htmlDecoder = new HtmlEntities();
		var me = this;
		this.on('message', function (from, to, message) {
                    if(me.irc == null )
                        return;
                    if(from == me.irc.opt.nick)
                        return;
                    message = message.trim();
                    if(message.startsWith('!mac ')){

                        var vendor = '';
                        var curl = new Curl();
                        url = "http://api.macvendors.com/" + htmlDecoder.encode(message.substring(5).trim());
                        curl.setOpt('FOLLOWLOCATION', true );
                        curl.setOpt('URL', url);
                        curl.on( 'end', function( statusCode, body, headers ) {
                            vendor = htmlDecoder.decode(body);
                            if ( vendor == "")
                                return;
                            me.irc.say(to, from + ': ' + vendor);

                        });
                        curl.on('error', function(){curl.close();});
                        curl.perform();
                    }
		});
	}
});
