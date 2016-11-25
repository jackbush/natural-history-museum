module.exports = function (req, res) {
	res.locals.viewConfig.title = 'Home';
	res.render('home');
};
