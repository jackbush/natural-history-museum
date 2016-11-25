var gulp = require('gulp');
var notify = require('gulp-notify');
var sourcemaps = require('gulp-sourcemaps');
var browserSync = require('browser-sync');
var es = require('event-stream');
var rename = require('gulp-rename');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var browserify = require('browserify');
var watchify = require('watchify');

var reload = browserSync.reload;
var config = require('../config').js;

gulp.task('js-dev', function () {
	var directories = config.directories;

	function getFileName (directory) {
		return config.src + config.directoryPrefix + directory + '/index.js';
	}

	var errorHandler = function () {
		var args = Array.prototype.slice.call(arguments);
		notify.onError({
			title: 'JS Error',
			message: '<%= error.message %>'
		}).apply(this, args);
		this.emit('end');
	};

	var tasks = directories.map(function (directory) {
		var entry = getFileName(directory);

		var bundler = watchify(browserify({
			entries: [entry],
			cache: {},
			packageCache: {},
			fullPaths: true,
			debug: true
		}));

		var rebundle = function () {
			return bundler.bundle()
				.on('error', errorHandler)
				.pipe(source(entry))
				.pipe(buffer())
				.pipe(sourcemaps.init({
					loadMaps: true
				}))
				.pipe(rename({
					basename: '' + directory,
					extname: config.outputSuffix,
					dirname: ''
				}))
				.pipe(sourcemaps.write('.'))
				.pipe(gulp.dest(config.dest))
				.pipe(reload({
					stream: true
				}));
		};

		bundler.on('update', rebundle);

		return rebundle();
	});

	return es.merge.apply(null, tasks);
});
