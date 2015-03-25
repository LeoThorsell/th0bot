var domain = require('domain');
if (typeof String.prototype.endsWith !== 'function') {
    String.prototype.endsWith = function(suffix) {
        return this.indexOf(suffix, this.length - suffix.length) !== -1;
    };
}

var moduleManager = {
	modules: [],
	irc: null,

	add: function(module){
		if(!module.name)
			return;
		module.moduleManager = this;
		module.on = function(eventName, cb){
			if(eventName == 'pm')
				module.pmCallback = cb;
			else if(eventName == 'message')
				module.messageCallback = cb;
		};
		this.modules[module.name] = module;
	},
	init: function(irc, path){
		path = path || './modules/';
		this.irc = irc;
		var mm = this;
		require('fs').readdirSync(path).forEach(function(file){
			if(!file.endsWith('.js'))
				return;
			console.log(path + file);
			var d = domain.create();
			var name = file.substring(3);
			d.on('error', function(err){
				console.log(file + ' ' + err);
				var module = mm.modules[name];
				if(module == null)
					return;
				mm.modules.delete[name];
				console.log(name + ' removed from manager');
			});
			d.run(function(){
				require(path + file);
			});
		});
		for(var name in this.modules){
			var module = this.modules[name];
			module.irc = irc;
			console.log('Loading module ' + name );
			if(typeof(module.init) == 'function'){
				console.log('Calling init()');
				module.init();	
			}
		}
		var me = this;
		irc.addListener('pm', function(from, msg){
			me.privateMessage(from, msg);
		});	
		irc.addListener('message', function(from, to, msg){
			me.message(from, to, msg);
		});
	},
	privateMessage: function(from, msg){
		for(var name in this.modules){
			var module = this.modules[name];
			if( typeof(module.pmCallback) != 'function')
				continue;
			try
			{
				module.pmCallback(from, msg);
			}catch(e){
				console.log( 'Module ' + name + ' on pm: ' + e);
			}
		}	
	},
	message: function(from, to, message){
		for(var name in this.modules){
			var module = this.modules[name];
			if(typeof(module.messageCallback)!='function')
				continue;
			try
			{
				module.messageCallback(from, to, message);
			}catch(e){
				console.log('Module ' + name + ' on message: ' + e);
			}
		}
	}
};
module.exports =  moduleManager;
moduleManager.add({
	name: 'ModuleManager',
	init: function(){
		var me = this;
		this.on('pm', function(from, msg){
			if(from != 'LeoTho')
				return;
			if(msg[0]!= '!')
				return;
			console.log('mm on pm');
			var splitted = msg.split(' ');
			var action = splitted[0];
			action = action.substring(1);
			var argument = splitted.splice(1, Number.MAX_VALUE).join(' ');
			me.performAction(action, argument);
		});	
	},
	performAction: function(action, argument){
		console.log('performAction');
		if(action == "reload"){
			for( var name in this.moduleManager.modules){
				if( name != argument)
					continue;
				delete this.moduleManager.modules[name];
				console.log('delete done');
			}
			var name = argument;
			delete require.cache[require.resolve('./modules/' + name + '.js')];
			try{
				console.log('./modules/' + name + '.js');
				require('./modules/' + name + '.js');
			}
			catch(e){
				console.log(e);
			}
			var module = this.moduleManager.modules[name];
			if(module == null)
				return;
			module.irc = this.irc;
			module.init();
			console.log('init done');
		}
	}
});
