var gulp = require('gulp');
var clientDependencies = require('./clientdependencies.json');

gulp.task('client-dependencies', function (callback) {
	var sources = [];
	var sourceRootPath = './' + clientDependencies.rootPath + '/';
	clientDependencies.dependencies.forEach(function(dependency) {
		sources.push(sourceRootPath + dependency);
	});
	gulp.src(sources, {base: clientDependencies.rootPath})
		.pipe(gulp.dest('src/lib'));
});

gulp.task('default', ['client-dependencies'])