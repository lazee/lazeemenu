'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
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
    .pipe(gulp.dest('./dist/css'));
});

gulp.task('sass:watch', function () {
  gulp.watch('./src/sass/**/*.scss', ['sass']);
});

gulp.task('default', function(callback) {
  runSequence('clean', 'sass');
});
