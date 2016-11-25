var path = require('path');
var express = require('express');
var morgan = require('morgan');

// Log things!
exports.logger = function () {
	return morgan('dev');
};

// Set a random-ish expire time, to force a hard relaod when we redeploy
exports.randomExpire = function () {
	return express.static(path.join(__dirname, '../public'), {
		maxAge: ~~(Math.random() * 123456789) + 1000000
	});
};

// Initialise view options
exports.viewConfig = function (req, res, next) {
	res.locals.viewConfig = {};
	next();
};
