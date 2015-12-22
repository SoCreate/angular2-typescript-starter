var gulp = require('gulp');
var connect = require('gulp-connect');
var open = require('gulp-open');
var del = require('del');
var tsc = require('gulp-typescript');
var sourcemaps = require('gulp-sourcemaps');
var fs = require('fs');
var mkdirp = require('mkdirp');
var getDirName = require('path').dirname;
var syncRequest = require('sync-request');
var clientDependencies = require('./clientdependencies.json');
var runSequence = require('run-sequence');
var rename = require('gulp-rename');
var changed = require('gulp-changed');

gulp.task('client-dependencies', function () {
	var dest = 'src/client_dependencies';
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
	gulp.src('./src/**/*ts')
		.pipe(changed('src/', { extension: 'js' }))
		.pipe(sourcemaps.init())
		.pipe(tsc(tsProject))
		.pipe(sourcemaps.write('./', { sourceRoot: '/' }))
		.pipe(gulp.dest('src/'));
});

gulp.task('watch-ts', ['compile-ts'], function () {
	gulp.watch('src/**/*.ts', ['compile-ts']);
});

gulp.task('serve', ['compile-ts'], function () {
	String.prototype.endsWith = function (suffix) {
		return this.indexOf(suffix, this.length - suffix.length) !== -1;
	};

	var port = 8000;
	connect.server({
		root: 'src',
		port: port,
		host: '127.0.0.1',
		fallback: 'src/index.html',
		livereload: true
    });

    gulp.watch(['src/**/*.ts', 'src/**/*.js', 'src/**/*.js.map', 'src/**/*.css', 'src/**/*.html'], function (fileInfo) {
		var filePath = fileInfo.path;
		if (filePath.endsWith('.ts')) {
			if (fileInfo.type === 'deleted') {
				var prefix = filePath.slice(0, filePath.length - 3);
				del([prefix + '.js', prefix + '.js.map']);
			} else {
				runSequence('compile-ts');
			}
		} else {
			gulp.src(filePath).pipe(connect.reload());
		}
    });
});

gulp.task('build-sandbox', function () {
	gulp.src('./src/index.html')
		.pipe(rename('sandbox.html'))
		.pipe(gulp.dest('./src'));
	gulp.src('./src/index.ts')
		.pipe(rename('sandbox.ts'))
		.pipe(gulp.dest('./src'));
});

gulp.task('default', function () {
	runSequence('client-dependencies', ['compile-ts']);
});