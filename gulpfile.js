var gulp = require('gulp');
var gls = require('gulp-live-server');
var del = require('del');
var clientDependencies = require('./clientdependencies.json');

gulp.task('client-dependencies', function (callback) {
	var dest = 'src/client-dependencies'
	del.sync([dest]);
	var sources = [];
	var sourceRootPath = './' + clientDependencies.rootPath + '/';
	clientDependencies.dependencies.forEach(function(dependency) {
		sources.push(sourceRootPath + dependency);
	});
	gulp.src(sources, {base: clientDependencies.rootPath})
		.pipe(gulp.dest(dest));
});

gulp.task('serve', function() {
    var server = gls.static('src', 8000);
    server.start();
    gulp.watch(['src/**/*.js', 'src/**/*.css', 'src/**/*.html'], function () {
        server.notify.apply(server, arguments);
    });
});

gulp.task('default', ['client-dependencies'])