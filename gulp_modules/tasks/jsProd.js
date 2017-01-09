var gulp = require('gulp');
var es = require('event-stream');
var rename = require('gulp-rename');
var babel = require('babelify');
var uglify = require('gulp-uglify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var browserify = require('browserify');

var config = require('../config').js;

gulp.task('js-prod', function () {
	var directories = config.directories;

	function getFileName (directory) {
		return config.src + config.directoryPrefix + directory + '/index.js';
	}

	var tasks = directories.map(function (directory) {
		var entry = getFileName(directory);

		var bundler = browserify({
			entries: [entry],
			cache: {},
			packageCache: {},
			fullPaths: true
		}).transform(babel, {presets: ['es2015']});

		var bundle = function () {
			return bundler.bundle()
				.pipe(source(entry))
				.pipe(buffer())
				.pipe(uglify())
				.pipe(rename({
					basename: '' + directory,
					extname: config.outputSuffix,
					dirname: ''
				}))
				.pipe(gulp.dest(config.dest));
		};

		return bundle();
	});

	return es.merge.apply(null, tasks);
});
