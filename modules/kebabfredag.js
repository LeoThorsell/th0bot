require('../leoLibrary.js');
var http = require('../http.js');
var mm =  require('../moduleManager.js');
var questionTriggerExpr = /^[äe]re?\s+(det?\s+)?kebabfredag\?[?!\s]*$/i;
var kebabApiUrl = "https://ere.kebabfredag.nu/api/";

mm.add({
  name: 'kebabfredag',
  init: function(irc) {

    function kebabQuery(cb) {
      var url = kebabApiUrl + "ere";
      http
        .get(url, {headers:{'Accept':'application/json'}})
        .then((res) => {
          var data;
          try {
            data = JSON.parse(res.body);
          } catch (e) {
            console.log('Lol ere.kebabfredag.nu\'s api är trasigt!', e);
            return;
          }
          if (data && data.hasOwnProperty('answer')) {
            cb(data.answer ? 'Jepp, det är kebabfredag.' : 'Nepp, inte kebabfredag idag :(');
          } else {
            cb();
          }
        });
    }
    function onCmd(from, channel, message, target, respond) {
      kebabQuery(res => {
        res && respond(res);
      });
    }

    irc.on('chancmd:kebab', onCmd);
    irc.on('chancmd:kebabfredag', onCmd);
    irc.on('chanmsg', (from, channel, message, target, respond) => {
      var uinfo = irc.tools.parseUserinfo(from);
      if(uinfo.nick == irc.connection.nick)
        return;
      message = message.trim();
      if(!questionTriggerExpr.test(message))
        return;
      kebabQuery(res => {
        irc.send(`PRIVMSG ${channel} :${uinfo.nick}: ${res}`);
      })
    });
  }
});
