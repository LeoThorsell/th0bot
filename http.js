var Curl = require('node-libcurl').Curl

var get = function(url, options) {
	return new Promise((resolve, reject) => {
		options = options || {};
	
		var headers = Object.assign({
			'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:40.0) Gecko/20100101 Firefox/40.1'
		},options.headers||{});
	
		var maxread = options.maxread || 0;

		var curl = new Curl();
		curl.setOpt(Curl.option.FOLLOWLOCATION, true);
		curl.setOpt(Curl.option.URL, url);
		curl.setOpt(Curl.option.HTTPHEADER, Object.keys(headers).map(key => `${key}: ${headers[key]}`));
		curl.setOpt( Curl.option.NOPROGRESS, false );	
		
		var resolved = false;
		var dataRead = '';
		curl.on('data', chunk => {
			dataRead += chunk;
			if (maxread > 0 && dataRead.length > maxread) {
				console.log(`http.get: reached maxread ${maxread}`);
				resolve({statusCode: 200, body: dataRead, headers, partial: true});
				resolved = true;
				dataRead = '';
				return 0;
			}
			return chunk.length;
		});
		curl.setProgressCallback(function(dltotal, dlnow)  {
			if (resolved) {
				return 1;
			}
			return 0;
		});

		curl.on('error', (err) => {
			curl.close();
			console.log('http.get: curl error: ', err);
			if (!resolved) {
				reject();
			}
		});
		curl.on('end', (statusCode, body, headers) => {
			curl.close();
			console.log('http.get: ended');
			if (!resolved) {
				resolve({statusCode, body, headers});
				resolved = true;
			}
		});
	
		curl.perform();
	});
};

module.exports = {
	get: get
}
