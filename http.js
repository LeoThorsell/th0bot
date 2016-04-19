var Curl = require('node-libcurl').Curl

var get = function(url, options) {
	options = options || {};
	var thenlistener, rejectlistener;

	var headers = Object.assign({
		'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:40.0) Gecko/20100101 Firefox/40.1'
	},options.headers||{});

	var curl = new Curl();
	curl.setOpt(Curl.option.FOLLOWLOCATION, true);
	curl.setOpt(Curl.option.URL, url);
	curl.setOpt(Curl.option.HTTPHEADER, Object.keys(headers).map(key => `${key}: ${headers[key]}`));

	curl.on('error', () => {
		curl.close();
		if (rejectlistener){
			rejectlistener();
		}
	});
	curl.on('end', (statusCode, body, headers) => {
		curl.close();
		if (thenlistener) {
			thenlistener(statusCode, body, headers);
		}
	});

	curl.perform();
	return {
		then: listener => { thenlistener = listener; return this; },
		reject: listener => { rejectlistener = listener; return this; } 
	}
};

module.exports = {
	get: get
}
