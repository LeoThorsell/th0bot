var mm =  require('../moduleManager.js');
require('../leoLibrary.js');
var http = require('http');
var elasticsearch = require('elasticsearch');
mm.add({
	name: 'search',
	init: function(){
		var me = this;
		this.on('message', function (from, to, message) {
			if(!message.startsWith('!search '))
				return;
			console.log('searching...');
			message = message.substring(8);
			var channel = to.substring(1);
			var client = new elasticsearch.Client({host:'localhost:9200'});
			client.search({
				index: 'irc',
				type: channel,
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
					me.irc.say(from, 'Not found!');
					return;
				}
				me.irc.say(from, "Hits: " + resp.hits.total);
				for(var i=0;i<5&&i<resp.hits.total;i++){
					var result = resp.hits.hits[i];
					var source = result._source;
					var time = new Date(result.fields._timestamp);
					me.irc.say(from, time.toISOString() + ": " + source.nick + ': ' + source.message);
				}
				
			},function(err){
				console.log('error in search: ' + err);
			});

		});
	}
});
