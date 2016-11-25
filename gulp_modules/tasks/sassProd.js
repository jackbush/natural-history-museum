var gulp = require('gulp');
var plumber = require('gulp-plumber');
var filter = require('gulp-filter');
var sass = require('gulp-sass');
var cleanCSS = require('gulp-clean-css');
var prefixer = require('gulp-autoprefixer');

var config = require('../config').sass;

gulp.task('sass-prod', function () {
	var files = config.files;

	files.forEach(function (file) {
		return gulp.src(config.src + file)
			.pipe(plumber({
				// Could log errors here.
			}))
			.pipe(sass({
				paths: ['sass']
			}))
			.pipe(prefixer('last 2 versions'))
			.pipe(cleanCSS({
				compatibility: 'ie10'
			}))
			.pipe(gulp.dest(config.dest))
			.pipe(filter('**/*.css'));
	});
});
