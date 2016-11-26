var gulp = require('gulp');
var copy = require('gulp-copy');
var config = require('../config').copy;

gulp.task('build-static', ['pug-prod'], function () {
	var globPaths = config.files;
	globPaths.forEach(function (path) {
		return gulp.src(path)
			// .pipe(copy(config.dest, {
			// 	//
			// }))
			.pipe(gulp.dest(config.dest));
	})
});
