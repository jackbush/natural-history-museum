var gulp = require('gulp');
var nodemon = require('gulp-nodemon');

var config = require('../config').app;

gulp.task('server', function (cb) {
	var called = false;
	nodemon({
		script: config.main,
		watch: ['./*']
	}).on('start', function () {
		if (!called) {
			called = true;
			cb();
		}
	});
});
