var mm =  require('../moduleManager.js');
require('../leoLibrary.js');
var http = require('http');
var elasticsearch = require('elasticsearch');
var moment = require('moment');
mm.add({
	name: 'seen',
	init: function(){
		var me = this;
		this.on('message', function (from, to, message) {
			if(!message.startsWith('!seen '))
				return;
			message = message.substring(6);
			
			var channel = to;
			if(message == me.irc.opt.nick){
				me.irc.say(channel, '*bonk*');
				return;
			}
			var client = new elasticsearch.Client({host:'localhost:9200'});
			client.search({
				index: 'irc',
				body:{
					fields : ["_source", "_timestamp"],
					sort: [
						{_timestamp: "desc"},
						{_score: "desc"}
					],
					query:{
						filtered:{
							filter:{
								term:{
									nick: message.toLowerCase()
								}
							}
						}
					}
					/*query:{
						match:{
							nick: message
						},
					}*/
				}
			}).then(function(resp){
				if(resp.hits.total==0){
					me.irc.say(channel, 'Not seen EvAH!');
					return;
				}
				console.log(resp.hits.total);
				var hit = resp.hits.hits[0];
				var time = new Date(hit.fields._timestamp);
				//me.irc.say(channel, hit._source.nick + ' was last seen @ ' + time.toISOString() + ' (msgcount=' + resp.hits.total + ' (ingen tävling...))');
				
				me.irc.say(channel, hit._source.nick + ' was last seen ' + moment(time).fromNow() + ' (' + resp.hits.total + ')');
				
			},function(err){
				console.log('error in search: ' + err);
			});

		});
	}
});
