var gulp = require('gulp');
var browserSync = require('browser-sync');

var config = require('../config').app;

gulp.task('browser-sync', ['server'], function () {
	browserSync({
		proxy: 'localhost:3000',
		port: config.browserSyncPort,
		open: false,
		notify: false
	});
});
