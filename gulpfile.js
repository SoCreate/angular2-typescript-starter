var gulp = require('gulp');
var gls = require('gulp-live-server');
var open = require('gulp-open');
var remoteSrc = require('gulp-remote-src');
var del = require('del');
var tsd = require('gulp-tsd');
var tsc = require('gulp-typescript');
var sourcemaps = require('gulp-sourcemaps');
var fs = require('fs');
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
	var modulesRootPath = './' + clientDependencies.modulesRootPath + '/';
	clientDependencies.dependencies.forEach(function (dependency) {
		sources.push(modulesRootPath + dependency);
	});
	gulp.src(sources, { base: clientDependencies.modulesRootPath })
		.pipe(gulp.dest(dest));

	var remoteSources = [];
	var remotesRootPath = './' + clientDependencies.remotesRootPath + '/';
	clientDependencies.remoteDependencies.forEach(function (dependency) {
		// TODO: might want to throw an error message if wrong remote url is used.
		var path = dependency.slice(dependency.indexOf('://') + 2);
		var fullPath = remotesRootPath + path;
		if (fs.existsSync(fullPath)) {
			remoteSources.push(fullPath);
		}
		else {
			fs.readFileSync(dependency, function (err, data) {
				if (err) throw err
				else {
					fs.writeFileSync(fullPath);
					remoteSources.push(fullPath);
				}
			});
		}
	});
	gulp.src(remoteSources, { base: clientDependencies.remotesRootPath })
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
	var port = 8000;
    var server = gls.static('src', port);
    server.start();
	gulp.src('./src/index.html')
		.pipe(open('', { url: 'http://localhost:' + port }));
    gulp.watch(['src/**/*.js', 'src/**/*.css', 'src/**/*.html'], function () {
        server.notify.apply(server, arguments);
    });
});

gulp.task('default', ['get-tsds', 'client-dependencies', 'compile-ts'])