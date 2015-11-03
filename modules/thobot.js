require('../leoLibrary.js');

var mm = require('../moduleManager.js');
var moment = require('moment');

mm.add({
    name: 'pull',
    init: function(){
        var me = this;
        this.on('message' , function (from, to, message) {
            if(from == me.irc.opt.nick)
                return;
            
            message = message.trim();
            if(message.startsWith('!pull'))
            {
                me.irc.say(to, me.irc.opt.nick + ' tar gärna imot pull requests. Titta här: https://github.com/LeoThorsell/th0bot/');
            }
            else
                return;

        });

    }
});

