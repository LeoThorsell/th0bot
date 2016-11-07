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
			var name = file;
			d.on('error', function(err){
				console.log(file + ' ' + err);
				if (err.stack)
					console.log(err.stack);
				var module = mm.modules[name];
				if(module == null)
					return;
				mm.modules.delete[name];
				console.log(name + ' removed from manager');
			});
			d.run(function(){
				try {
					require(path + file);
				} catch (e) {
					console.error(`Error loading module ${name}: ${e}`);
					if (e.stack)
						console.error(e.stack);
				}
			});
		});
		for(var name in this.modules){
			var module = this.modules[name];
			module.irc = irc;
			console.log('Loading module ' + name );
			if(typeof(module.init) == 'function'){
				console.log('Calling init()');
				try {
					module.init(irc);	
				} catch (e) {
					console.error(`Error initializing module ${name}: ${e}`);
					if (e.stack)
						console.error(e.stack);
				}
			}
		}
	}
};
module.exports =  moduleManager;
/*moduleManager.add({
name: 'ModuleManager',
init: function(){
this.irc.on('botmsg', function(from, msg){
if(this.irc.tools.parseUserinfo(from).nick != 'LeoTho')
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
});*/
