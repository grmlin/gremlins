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
var markdox = require("gulp-markdox");
var eslint = require('gulp-eslint')

var through2 = require('through2');
var browserify = require('browserify');
var babelify = require("babelify");
var transform = require('vinyl-transform');
var sourcemaps = require('gulp-sourcemaps');


gulp.task('lint', function () {
	// Note: To have the process exit with an error code (1) on
	//  lint error, return the stream and pipe to failOnError last.
	return gulp.src(["index.js", "./lib/**/*.js", '!./lib/**/{__tests__,__tests__/**}'])
		.pipe(eslint())
		.pipe(eslint.format())
		.pipe(eslint.failOnError());
});


gulp.task('scriptsTest', [/*'lint'*/], function () {



	return gulp.src('lib/__tests__/index.js')
		.pipe(through2.obj(function (file, enc, next){
			browserify({
				standalone: 'gremlins',
				debug: false
			})
				.add('document-register-element/build/document-register-element.max.js')
				.add(file.path)
				.transform('babelify')
				.bundle(function(err, res){
					// assumes file.contents is a Buffer
					file.contents = res;
					next(null, file);
				});
		}))
		//.pipe(browserified)
		//.pipe(sourcemaps.init({loadMaps: true}))
		// Add transformation tasks to the pipeline here.
		//.pipe(uglify())
		//.pipe(sourcemaps.write())
		//.pipe(concat('spec.js'))
		//.pipe(sourcemaps.init({loadMaps: true}))
		//.pipe(sourcemaps.write())
		.pipe(gulp.dest('./test/specs'));
});

gulp.task('uglify', ['lint'], function () {

	return gulp.src('lib/gremlins.js')
		.pipe(through2.obj(function (file, enc, next){
			browserify({
				standalone: 'gremlins',
				debug: false
			})
				.add('document-register-element')
				.add(file.path)
				.transform('babelify')
				.bundle(function(err, res){
					// assumes file.contents is a Buffer
					file.contents = res;
					next(null, file);
				});
		}))
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

gulp.task('connect', function () {
	connect.server({
		root: ['test'],
		port: 8000,
		livereload: false
	})();
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
	gulp.watch(['lib/**/*'], ['scriptsTest', 'reload', 'doc']);
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
	return gulp.src(["./lib/**/*.js", '!./lib/**/{__tests__,__tests__/**}'])
		.pipe(markdox())
		.pipe(rename({
			extname: '.md'
		}))
		.pipe(gulp.dest("./doc"));
});

gulp.task('default', ['connect', 'scriptsTest', 'doc', 'watch']);
gulp.task('build', ['uglify', 'sizereport']);