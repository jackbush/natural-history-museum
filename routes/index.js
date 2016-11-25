var middleware = require('./middleware');
var controllers = require('../lib/loadControllers')();

module.exports = function (app) {
	// Middleware
	app.use(middleware.logger());
	app.use(middleware.randomExpire());
	app.use(middleware.viewConfig);

	// Views!
	app.get('/', controllers.home);
};
