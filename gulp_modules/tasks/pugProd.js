var gulp = require('gulp');
var pug = require('gulp-pug');
var plumber = require('gulp-plumber');
var filter = require('gulp-filter');
var rename = require('gulp-rename');

var config = require('../config').pug;

gulp.task('pug-prod', function () {
	return gulp.src(config.src)
		.pipe(plumber({}))
		.pipe(pug({}))
		.pipe(rename({
			basename: config.newName,
			extname: '.html'
		}))
		.pipe(gulp.dest(config.dest));
});
