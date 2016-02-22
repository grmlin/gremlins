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
var eslint = require('gulp-eslint');
var clean = require('gulp-clean');
var through2 = require('through2');
var browserify = require('browserify');
var babelify = require("babelify");
var rename = require("gulp-rename");
var babel = require("gulp-babel");

var filenames = {
	'index': 'gremlins',
	'native': 'gremlins.native'
};

gulp.task('lint', function () {
	// Note: To have the process exit with an error code (1) on
	//  lint error, return the stream and pipe to failOnError last.
	return gulp.src(["./src/**/*.js", '!./src/**/{__tests__,__tests__/**}'])
		.pipe(eslint())
		.pipe(eslint.format())
		.pipe(eslint.failOnError());
});

gulp.task("babel", function () {
	return gulp.src("src/**/*.js")
		.pipe(babel())
		.pipe(gulp.dest("lib"));
});

gulp.task('browserify:test', ['babel'], function () {
	return gulp.src('lib/__tests__/index.js')
		.pipe(through2.obj(function (file, enc, next) {
			browserify(file.path, {
				standalone: 'gremlins',
				debug: false
			})
				.bundle(function (err, res) {
					if (err) {
						console.log(err);
					}
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

gulp.task('uglify', ['lint', 'clean-dist', 'babel'], function () {

	return gulp.src(['lib/index.js', 'lib/native.js'])
		.pipe(through2.obj(function (file, enc, next) {
			browserify(file.path, {
				standalone: 'gremlins',
				debug: false
			})
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
			if (path.extname === '.js' && filenames[path.basename]) {
				path.basename = filenames[path.basename];
			}
		}))
		.pipe(wrap({src: 'build/licenseHeader.tpl'}, {version: version}, {variable: 'data'}))
		.pipe(gulp.dest('dist'));
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


gulp.task("reload", function () {
	gulp.src('src/index.js')
		.pipe(connect.reload());
});

gulp.task('watch', function () {
	gulp.watch(['src/**/*'], ['browserify:test', 'reload']);
});

gulp.task('sizereport', function () {
	return gulp.src('./dist/*')
		.pipe(sizereport({
			gzip: true
		}));
});

gulp.task('default', ['connect', 'browserify:test', 'watch']);
gulp.task('build', ['uglify']);