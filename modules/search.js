var mm =  require('../moduleManager.js');
require('../leoLibrary.js');
var http = require('http');
var elasticsearch = require('elasticsearch');
mm.add({
	name: 'search',
	init: function(irc){
		irc.on('chancmd:search', function (from, channel, message, target, respond) {
			var uinfo = irc.tools.parseUserinfo(from);
			console.log('searching...');
			var say = (msg) => {
				irc.send(`PRIVMSG ${uinfo.nick} :${msg}`);
			};
			var client = new elasticsearch.Client({host:'localhost:9200'});
			client.search({
				index: 'irc',
				type: channel.substring(1),
				body:{
					fields : ["_source", "_timestamp"],
					query:{
						match:{
							message: message
						},
					}
				}
			}).then(function(resp){
				if(resp.hits.total==0){
					say('Not found!');
					return;
				}
				say("Hits: " + resp.hits.total);
				for(var i=0;i<5&&i<resp.hits.total;i++){
					var result = resp.hits.hits[i];
					var source = result._source;
					var time = new Date(result.fields._timestamp);
					say(time.toISOString() + ": " + source.nick + ': ' + source.message);
				}

			},function(err){
				console.log('error in search: ' + err);
			});

		});
	}
});
