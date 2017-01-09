var sounds = require('../bin/bioacoustica2015/meta.xml.json');

module.exports = function (req, res) {
	res.locals.viewConfig.title = 'Home';
	res.locals.sounds = sounds;
	res.render('home');
};
