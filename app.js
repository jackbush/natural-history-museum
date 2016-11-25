// Simulate config options from other environments by
// customising the .env file in your project's root folder.
require('dotenv').load();

var express = require('express');
var path = require('path');
var app = express();

// View engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Our routes
require('./routes/index.js')(app);

// Error handler
require('./lib/errorHandler.js')(app);

module.exports = app;
