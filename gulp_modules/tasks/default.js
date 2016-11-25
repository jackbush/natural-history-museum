var gulp = require('gulp');
var browserSync = require('browser-sync');
var reload = browserSync.reload;

var config = require('../config');

gulp.task('default', ['js-dev', 'sass-dev', 'browser-sync'], function () {
	// JS watch is inside the js-dev task
	gulp.watch(config.sass.src + '**/*.s?ss', ['sass-dev']);
	gulp.watch(config.pug.src + '**/*.pug').on('change', reload);
});
