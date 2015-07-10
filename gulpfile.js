var gulp = require('gulp');
var gls = require('gulp-live-server');
var del = require('del');
var tsd = require('gulp-tsd');
var tsc = require('gulp-typescript');
var sourcemaps = require('gulp-sourcemaps');
var clientDependencies = require('./clientdependencies.json');

gulp.task('get-tsds', function (callback) {
    tsd({
        command: 'reinstall',
        config: './tsd.json'
    }, callback);
});

gulp.task('client-dependencies', function (callback) {
	var dest = 'src/client-dependencies'
	del.sync([dest]);
	var sources = [];
	var sourceRootPath = './' + clientDependencies.rootPath + '/';
	clientDependencies.dependencies.forEach(function (dependency) {
		sources.push(sourceRootPath + dependency);
	});
	gulp.src(sources, { base: clientDependencies.rootPath })
		.pipe(gulp.dest(dest));
});

gulp.task('compile-ts', function () {
	var tsProject = tsc.createProject('tsconfig.json', {
		typescript: require('typescript')
	});
	var result = gulp.src('./src/**/*ts')
		.pipe(tsc(tsProject));

	return result.js
		.pipe(gulp.dest('src/'));
});

gulp.task('serve', function () {
    var server = gls.static('src', 8000);
    server.start();
    gulp.watch(['src/**/*.js', 'src/**/*.css', 'src/**/*.html'], function () {
        server.notify.apply(server, arguments);
    });
});

gulp.task('default', ['get-tsds', 'client-dependencies', 'compile-ts'])