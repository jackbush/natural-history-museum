var gulp = require('gulp');
var plumber = require('gulp-plumber');
var filter = require('gulp-filter');
var notify = require('gulp-notify');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var prefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync');

var reload = browserSync.reload;
var config = require('../config').sass;

gulp.task('sass-dev', function () {
	var files = config.files;

	files.forEach(function (file) {
		return gulp.src(config.src + file)
			.pipe(plumber({
				errorHandler: notify.onError('SASS Error: <%= error.message %>')
			}))
			.pipe(sourcemaps.init())
			.pipe(sass({
				paths: ['sass']
			}))
			.pipe(prefixer('last 2 versions'))
			.pipe(sourcemaps.write())
			.pipe(gulp.dest(config.dest))
			.pipe(filter('**/*.css'))
			.pipe(reload({
				stream: true
			}));
	});
});
