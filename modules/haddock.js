require('../leoLibrary.js');
var mm =  require('../moduleManager.js');
var Curl = require('node-libcurl').Curl
var HtmlEntities = require('html-entities').AllHtmlEntities;

mm.add({
	name: 'haddock',
	init: function(){
		var htmlDecoder = new HtmlEntities();
		var me = this;
		this.on('message', function (from, to, message) {
                    if(me.irc == null )
                        return;
                    if(from == me.irc.opt.nick)
                        return;
                    message = message.trim();
                    if(message.startsWith('!haddock')){
                        var vendor = '';
                        var curl = new Curl();
                        curl.setOpt('FOLLOWLOCATION', true );
                        curl.setOpt('URL', "https://haddock.updog.se/");
                        curl.on( 'end', function( statusCode, body, headers ) {
                            console.log(body);
                            var haddockMatch = /<h1 class="title">([\s\S]+?)<\/h1>/gi.exec(body);
                            if(haddockMatch == null){
                                return
                            }
                            var haddock = htmlDecoder.decode(haddockMatch[1]);
                            me.irc.say(to, haddock);

                        });
                        curl.on('error', function(){curl.close();});
                        curl.perform();
                    }
		});
	}
});
