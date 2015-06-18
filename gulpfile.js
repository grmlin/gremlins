var gulp = require('gulp');
var gutil = require('gulp-util');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var rename = require("gulp-rename");
var connect = require('gulp-connect');
var sizereport = require('gulp-sizereport');
var wrap = require("gulp-wrap");
var version = require('./package.json').version;
var pkg = require('./package.json');
var eslint = require('gulp-eslint')
var clean = require('gulp-clean');
var through2 = require('through2');
var browserify = require('browserify');
var babelify = require("babelify");
var rename = require("gulp-rename");

var filenames = {
	'index': 'gremlins',
	'native': 'gremlins.native'
};

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
		.pipe(through2.obj(function (file, enc, next) {
			browserify(file.path, {
				standalone: 'gremlins',
				debug: false
			})
				.transform('babelify')
				.bundle(function (err, res) {
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

gulp.task('uglify', ['lint', 'clean-dist'], function () {

	return gulp.src(['index.js', 'native.js'])
		.pipe(through2.obj(function (file, enc, next) {
			browserify(file.path, {
				standalone: 'gremlins',
				debug: false
			})
				.transform('babelify')
				.bundle(function (err, res) {
					// assumes file.contents is a Buffer
					file.contents = res;
					next(null, file);
				});
		}))
		.pipe(uglify({
			outSourceMap: false,
			mangle: true
		}))
		.pipe(rename(function (path) {
			gutil.log(path);

			if (path.extname === '.js' && filenames[path.basename]) {
				path.basename = filenames[path.basename];
			}
			//path.dirname += "/ciao";
			//path.basename += "-goodbye";
			//path.extname = ".md"
		}))
		.pipe(wrap({src: 'build/licenseHeader.tpl'}, {version: version}, {variable: 'data'}))
		.pipe(gulp.dest('dist'))
});

gulp.task('clean-dist', function () {
	return gulp.src('dist/*', {read: false})
		.pipe(clean());
});

gulp.task('connect', function () {
	connect.server({
		root: 'test',
		livereload: false,
		port: 8000
	});
});


gulp.task("compress", function () {
	gulp.src("dist/watched.min.js")
		.pipe(gulp.dest("dist"));
});

gulp.task("reload", function () {
	gulp.src('lib/watched.js')
		.pipe(connect.reload());
});

gulp.task('watch', function () {
	gulp.watch(['lib/**/*'], ['scriptsTest', 'reload']);
});

gulp.task('sizereport', function () {
	return gulp.src('./dist/*')
		.pipe(sizereport({
			gzip: true
		}));
});

gulp.task('default', ['connect', 'scriptsTest', 'watch']);
gulp.task('build', ['uglify']);