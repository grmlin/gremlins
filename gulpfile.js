var gulp = require('gulp');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var rename = require("gulp-rename");
var gzip = require("gulp-gzip");
var connect = require('gulp-connect');
var sizereport = require('gulp-sizereport');
var wrap = require("gulp-wrap");
var version = require('./package.json').version;
var pkg = require('./package.json');
var jsdoc = require("gulp-jsdoc");

var browserify = require('browserify');
var transform = require('vinyl-transform');
var sourcemaps = require('gulp-sourcemaps');

//var browserified = transform(function(filename) {
//    var b = browserify(filename, {
//			standalone: 'watched'
//		});
//    return b.bundle();
//});

gulp.task('scriptsTest', function () {

	var browserified = transform(function (filename) {
		var b = browserify(filename, {
			standalone: 'gremlins',
			debug: false
		});
		return b.bundle();
	});

	return gulp.src('src/**/__tests__/*.js')
		.pipe(browserified)
		//.pipe(sourcemaps.init({loadMaps: true}))
		// Add transformation tasks to the pipeline here.
		//.pipe(uglify())
		//.pipe(sourcemaps.write())
		.pipe(concat('spec.js'))
		//.pipe(sourcemaps.init({loadMaps: true}))
		//.pipe(sourcemaps.write())
		.pipe(gulp.dest('./test/specs'));
});

gulp.task('connect', function () {
	connect.server({
		root: ['test'],
		port: 8000,
		livereload: false
	})();
});


gulp.task('uglify', function () {

	var browserified = transform(function (filename) {
		var b = browserify(filename, {
			standalone: 'gremlins',
			debug: false
		});
		return b.bundle();
	});

	return gulp.src('gremlins.js')
		.pipe(browserified)
		.pipe(wrap({src: 'build/licenseHeader.tpl'}, {version: version}, {variable: 'data'}))
		.pipe(gulp.dest('./dist'))
		.pipe(uglify({
			outSourceMap: false,
			mangle: true
		}))
		.pipe(rename({
			suffix: ".min"
		}))
		.pipe(wrap({src: 'build/licenseHeader.tpl'}, {version: version}, {variable: 'data'}))
		.pipe(gulp.dest('dist'))
		.pipe(gzip())
		.pipe(gulp.dest("dist"));
});

gulp.task("compress", function () {
	gulp.src("dist/watched.min.js")
		.pipe(gzip())
		.pipe(gulp.dest("dist"));
});

gulp.task("reload", function () {
	gulp.src('lib/watched.js')
		.pipe(connect.reload());
});

gulp.task('watch', function () {
	gulp.watch(['src/**/*'], ['scriptsTest', 'reload', 'doc']);
});

gulp.task('sizereport', function () {
	return gulp.src('./dist/*')
		.pipe(sizereport({
			gzip: true
		}));
});

var opts = {
	showPrivate: true,
	monospaceLinks: true,
	cleverLinks: true,
	outputSourceFiles: true
};

var tpl = {
	path: 'ink-docstrap',
	systemName: pkg.name,
	footer: 'Generated with gulp',
	copyright: 'Copyright WebItUp 2014',
	navType: 'vertical',
	theme: 'spacelab',
	linenums: true,
	collapseSymbols: false,
	inverseNav: false
};

gulp.task("doc", function () {
	return gulp.src([".index.js", "./src/**/*.js", '!./src/**/{__tests__,__tests__/**}', "README.md"])
		.pipe(jsdoc.parser({
			plugins: ['plugins/markdown'],
			name: pkg.name,
			description: pkg.description,
			version: pkg.version,
			licenses: pkg.licenses || [pkg.license],
		}))
		// Then generate the documentation and
		.pipe(jsdoc.generator('./doc/', tpl, {
			'private': false,
			monospaceLinks: false,
			cleverLinks: false,
			outputSourceFiles: true
		}));
});

gulp.task('default', ['connect', 'scriptsTest', 'doc', 'watch']);
gulp.task('build', ['uglify', 'sizereport']);