require('../leoLibrary.js');
var mm = require('../moduleManager.js');

mm.add({
    name: 'pull',
    init: function(){
        var me = this;
        this.on('message' , function (from, to, message) {
            if(from == me.irc.opt.nick)
                return;
            message = message.trim();
            if(message.startsWith('!pull pork'))
                me.irc.say(to, "I pulled that pork and served it to a dork!");
            return;
            if(message.startsWith('!pull finger')){
                me.irc.say(to, "You sure you want to do that?");
                me.irc.say(to, "                 prrrpt.");
                return;
            }
            if(message.startsWith('!pull'))
                me.irc.say(to, me.irc.opt.nick + ' tar gärna imot pull requests. Titta här: https://github.com/LeoThorsell/th0bot/');
            return
        });
    }
});
