require('../leoLibrary.js');
var mm =  require('../moduleManager.js');
var http = require('http');
var querystring = require('querystring');
var fs = require('fs');
var request = require('request');

mm.add({
	contacts: [],
	name: 'sms',
	init: function(){
		// LeoTho => #leotho: hej
		var me = this;
		this.sms = smsService;
		this.loadCredentials();
		this.loadContacts();
		this.sms.on('message',function(msg){
			console.log('received message');
			var fromName = null;
			console.log(me.contacts);
			for(var i=0;i<me.contacts.length;i++){
				if(me.contacts[i].number != msg.from)
					continue;
				fromName = me.contacts[i].nick;
			}
			if( fromName == null)
				fromName = msg.from;
			if(!fromName || !message)
				return;
			me.irc.say('#daladevelop', fromName + ' says: '+ msg.message);
		});
		

		this.on('message', function (from, to, message) {
			if(from == me.irc.opt.nick)
				return;
			message = message.trim();
			if(message.startsWith('!smsadd ')){
				message = message.substring(8).trim();
				me.addPerson(from, message);
				me.irc.say(to, 'råger.')
				return;
			}
			else if(message.startsWith('!sms ')){
				message = message.substring(5).trim();
				var splitted = message.split(' ');
				var nick = splitted.shift();
				for(var i=0;i<me.contacts.length;i++){
					if(nick != me.contacts[i].nick)
						continue;
					console.log('sending sms to: ' + me.contacts[i].number);
					me.sendSms(me.contacts[i].number, from + ': ' + splitted.join(' '));
					return;
				}
				me.irc.say(to, 'number not found');
			}
		});
	},
	addPerson: function(nick, number){
		var me = this;
		for(var i=0;i<this.contacts.length;i++){
			if(this.contacts[i].nick != nick)
				continue;
			this.contacts[i].number = number;
			me.saveContacts();
			return;
		}
		this.contacts.push({nick: nick, number: number});
		me.saveContacts();
	},
	saveContacts: function(){
		fs.writeFile('./data/smscontacts.json', JSON.stringify(this.contacts), function(err){
			if(err)
				console.log('failed to save contacts: ' + err);
			else
				console.log('contacts saved');
		});
	},
	loadContacts: function(){
		var me = this;
		fs.readFile('./data/smscontacts.json', 'utf8', function (err,data) {
			if (err) {
				return console.log(err);
			}
			me.contacts = JSON.parse(data);
			console.log(me.contacts.length + ' contacts loaded.');
		});
	},
	loadCredentials: function(){
		var me = this;
		fs.readFile('./data/smscredentials.json', 'utf8', function(err, data){
			me.credentials = JSON.parse(data);
			if(!me.sms.started)
				me.sms.init(me.credentials.port);
		});
	},
	sendSms: function(number, message){
		var username = this.credentials.username; 
		var password = this.credentials.password;
		console.log('sending message...');
		console.log(arguments);
		request.post('https://' + username + ':' + password + '@api.46elks.com/a1/SMS',
			{ form: 
				{ 
					from: '+46766861159',
					to: number,
					message: message	
				} 
			},
			function (error, response, body) {
				if(error)
					console.log('error sending sms: ' + error);
			}
	    	);
	}
});
var smsService = {
	onMessageCallbacks : [],
	started: false,
	on: function(evnt, cb){
		if(evnt != 'message')
			return;
		this.onMessageCallbacks.push(cb);
	},
	init: function(port){
		started = true;
		var me = this;
		console.log('starting sms server on ' + port);
		http.createServer(function (req, res) {
			console.log(req.url);
			if (req.method == 'POST') {
				console.log("POST");
				var body = '';
				req.on('data', function (data) {
					body += data;
				});
				req.on('end', function () {
					console.log("Body: " + body);
					var obj = querystring.parse(body);
					res.writeHead(200, {'Content-Type': 'text/html'});
					res.end();
					for(var i=0;i<me.onMessageCallbacks.length;i++){
						me.onMessageCallbacks[i](obj);
					}
				});
				req.on('error', function(){
					console.log(arguments);
				});
			}
		}).listen(port);
	}
};
