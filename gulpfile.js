var gulp = require('gulp');
var gls = require('gulp-live-server');
var open = require('gulp-open');
var del = require('del');
var tsd = require('gulp-tsd');
var tsc = require('gulp-typescript');
var sourcemaps = require('gulp-sourcemaps'); // do we need this?
var fs = require('fs');
var mkdirp = require('mkdirp');
var getDirName = require('path').dirname;
var syncRequest = require('sync-request');
var clientDependencies = require('./clientdependencies.json');
var runSequence = require('run-sequence');

gulp.task('get-tsds', function (callback) {
    tsd({
        command: 'reinstall',
        config: './tsd.json'
    }, callback);
});

gulp.task('client-dependencies', function () {
	var dest = 'src/client-dependencies'
	del.sync([dest]);

	var moduleSources = [];
	var modulesRootPath = './' + clientDependencies.modulesRootPath + '/';
	clientDependencies.dependencies.forEach(function (dependency) {
		moduleSources.push(modulesRootPath + dependency);
	});

	gulp.src(moduleSources, { base: clientDependencies.modulesRootPath })
		.pipe(gulp.dest(dest));

	var remoteSources = [];
	var remotesRootPath = './' + clientDependencies.remotesRootPath + '/';
	clientDependencies.remoteDependencies.forEach(function (dependencyUrl) {
		// TODO: might want to throw an error message if wrong remote url is used.
		var path = dependencyUrl.slice(dependencyUrl.indexOf('://') + 3);
		var fullPath = remotesRootPath + path;
		remoteSources.push(fullPath);

		if (!fs.existsSync(fullPath)) {
			mkdirp.sync(getDirName(fullPath), [], function (error) {
				if (error) {
					throw error;
				}
			});
			var data = syncRequest('GET', dependencyUrl)
			fs.writeFileSync(fullPath, data.getBody());
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

gulp.task('watch-ts', ['compile-ts'], function () {
	gulp.watch('src/**/*.ts', ['compile-ts']);
});

gulp.task('serve', function () {
	String.prototype.endsWith = function (suffix) {
		return this.indexOf(suffix, this.length - suffix.length) !== -1;
	};
	var port = 8000;
    var server = gls.static('src', port);
    server.start();
	gulp.src('./src/index.html')
		.pipe(open('', { url: 'http://localhost:' + port }));
    gulp.watch(['src/**/*.ts', 'src/**/*.js', 'src/**/*.css', 'src/**/*.html'], function (fileInfo) {
		var filePath = fileInfo.path;
		if (filePath.endsWith('.ts')) {
			if (fileInfo.type === 'deleted') {
				del([filePath.slice(0, filePath.length - 2) + 'js']);
			} else {
				runSequence('compile-ts');
			}
		} else {
			server.notify.apply(server, arguments);
		}
    });
});

gulp.task('default', function () {
	runSequence('get-tsds', ['client-dependencies', 'compile-ts']);
});