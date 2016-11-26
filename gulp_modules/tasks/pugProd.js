var gulp = require('gulp');
var pug = require('gulp-pug');
var plumber = require('gulp-plumber');
var filter = require('gulp-filter');

var config = require('../config').pug;

gulp.task('pug-prod', function () {
	return gulp.src(config.src + '*.pug')
		.pipe(plumber({
			// Could log errors here.
		}))
		.pipe(pug({
			// Your options in here. 
		}))
		.pipe(gulp.dest(config.destProd));
});
