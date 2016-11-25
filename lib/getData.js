var request = require('request');
var basePath = '';

module.exports = function (config) {
	// config.endpoint is a string

	var options = {
		url: basePath + config.endpoint,
		headers: {}
	};

	return new Promise(function (resolve, reject) {
		request(options, function (err, res, body) {
			if (!err && res.statusCode === 200) {
				var data = JSON.parse(body);
				resolve(data);
			} else {
				console.log('Error GET ' + options.url);
				console.log(res.headers);
				console.log(res.statusCode);
				if (res.headers['content-type'] === 'application/problem+json') {
					console.log(JSON.parse(body));
				}
				console.log('error: ', err);
				reject(err);
			}
		});
	});
};
