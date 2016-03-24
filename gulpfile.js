'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var cssmin = require('gulp-cssmin');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var jshint = require('gulp-jshint');
var nunjucksRender = require('gulp-nunjucks-render');
var ghPages = require('gulp-gh-pages');
var markdown = require('gulp-markdown');
var bump = require('gulp-bump');
var del = require('del');
var runSequence = require('run-sequence');
var release = require('gulp-github-release');
var zip = require('gulp-zip');

gulp.task('clean', function() {
    return del(['dist', '.sitedist', '.package']);
});

gulp.task('deepclean', function() {
    return del(['dist', '.sitedist', '.package', 'node_modules']);
});

gulp.task('sass', function() {
    return gulp.src('./src/sass/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./dist'));
});

gulp.task('minify-css', function() {
    gulp.src('./.package/lazeemenu/*.css')
        .pipe(cssmin())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('./dist'));
});

gulp.task('package', function() {
    gulp.src(['./LICENSE']).pipe(gulp.dest('./.package/lazeemenu'));
    gulp.src(['./README.md']).pipe(gulp.dest('./.package/lazeemenu'));
    gulp.src(['./package.json']).pipe(gulp.dest('./.package/lazeemenu'));
    gulp.src(['./dist/*.js']).pipe(gulp.dest('./.package/lazeemenu'));
    gulp.src(['./dist/*.css']).pipe(gulp.dest('./.package/lazeemenu'));
});

gulp.task('compress', function() {
    return gulp.src('./src/*.js')
        .pipe(uglify())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('./dist'));
});

gulp.task('lint', function() {
    return gulp.src('./src/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('cool-reporter'));
});

gulp.task('sass:watch', function() {
    gulp.watch('./src/sass/**/*.scss', ['sass']);
});

gulp.task('pages', function() {
    gulp.src(['./site/stylesheets/*.css']).pipe(gulp.dest('./.sitedist/stylesheets'));
    gulp.src(['./site/javascripts/*.js']).pipe(gulp.dest('./.sitedist/javascripts'));
    gulp.src(['./dist/*.css']).pipe(gulp.dest('./.sitedist/stylesheets'));
    gulp.src(['./site/images/**']).pipe(gulp.dest('./.sitedist/images'));
    gulp.src(['./dist/*.js']).pipe(gulp.dest('./.sitedist/javascripts'));
    gulp.src(['./site/bower_components/highlightjs/**']).pipe(gulp.dest('./.sitedist/javascripts/highlight.js'));
    gulp.src(['./node_modules/jquery/dist/jquery.min.js']).pipe(gulp.dest('./.sitedist/javascripts'));
    gulp.src(['./node_modules/bootstrap/dist/js/bootstrap.min.js']).pipe(gulp.dest('./.sitedist/javascripts'));
    gulp.src(['./node_modules/bootstrap/dist/css/bootstrap.min.css']).pipe(gulp.dest('./.sitedist/stylesheets'));
    return gulp.src('site/pages/*.html')
        .pipe(nunjucksRender({
            path: ['site/templates/', 'dist/md/']
        }))
        .pipe(gulp.dest('.sitedist'));
});

gulp.task('pages-deploy', function() {
  return gulp.src('./.sitedist/**/*')
    .pipe(ghPages());
});


//gulp.task('md', function () {
//    return gulp.src('README.md')
//        .pipe(markdown())
//        .pipe(gulp.dest('dist/md/'));
//});

gulp.task('bump', function(){
  gulp.src(['./bower.json', './package.json'])
  .pipe(bump({type:'patch'}))
  .pipe(gulp.dest('./'));
});

gulp.task('release', function() {
  gulp.src('./dist/lazeemenu.zip')
    .pipe(release({
      draft: false,
      prerelease: false,
      manifest: require('./package.json')
    }));
});

gulp.task('zip', function() {
    return gulp.src('./.package/**')
        .pipe(zip('lazeemenu.zip'))
        .pipe(gulp.dest('dist'));
});

gulp.task('default', function(callback) {
    runSequence('clean', 'sass', 'minify-css', 'lint', 'compress', 'pages', 'package');
});
