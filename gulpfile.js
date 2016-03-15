'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var cssmin = require('gulp-cssmin');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var jshint = require('gulp-jshint');
var del = require('del');
var runSequence = require('run-sequence');

gulp.task('clean', function() {
  return del(['dist']);
});

gulp.task('deepclean', function() {
  return del(['dist', 'node_modules']);
});

gulp.task('sass', function () {
  return gulp.src('./src/sass/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./dist'));
});

gulp.task('minify-css', function () {
	gulp.src('./dist/*.css')
		.pipe(cssmin())
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest('./dist'));
});

gulp.task('copy', function () {
    gulp.src(['./LICENSE']).pipe(gulp.dest('./dist'));
    gulp.src(['./README.md']).pipe(gulp.dest('./dist'));
    gulp.src(['./src/*.js']).pipe(gulp.dest('./dist'));
});

gulp.task('compress', function() {
  return gulp.src('./src/*.js')
    .pipe(uglify())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('./dist'));
});

gulp.task('lint', function() {
  return gulp.src('./src/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('cool-reporter'));
});

gulp.task('sass:watch', function () {
  gulp.watch('./src/sass/**/*.scss', ['sass']);
});

gulp.task('default', function(callback) {
  runSequence('clean', 'sass', 'minify-css', 'lint', 'copy', 'compress');
});
