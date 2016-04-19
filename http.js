var Curl = require('node-libcurl').Curl

var get = function(url, options) {
	return new Promise((resolve, reject) => {
		options = options || {};
	
		var headers = Object.assign({
			'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:40.0) Gecko/20100101 Firefox/40.1'
		},options.headers||{});
	
		var curl = new Curl();
		curl.setOpt(Curl.option.FOLLOWLOCATION, true);
		curl.setOpt(Curl.option.URL, url);
		curl.setOpt(Curl.option.HTTPHEADER, Object.keys(headers).map(key => `${key}: ${headers[key]}`));
	
		curl.on('error', () => {
			curl.close();
			reject();
		});
		curl.on('end', (statusCode, body, headers) => {
			curl.close();
			resolve({statusCode, body, headers});
		});
	
		curl.perform();
	});
};

module.exports = {
	get: get
}
