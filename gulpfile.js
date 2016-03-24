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

gulp.task('clean', function() {
    return del(['dist']);
});

gulp.task('deepclean', function() {
    return del(['dist', 'node_modules']);
});

gulp.task('sass', function() {
    return gulp.src('./src/sass/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./dist/package'));
});

gulp.task('minify-css', function() {
    gulp.src('./dist/package/*.css')
        .pipe(cssmin())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('./dist/package'));
});

gulp.task('copy', function() {
    gulp.src(['./LICENSE']).pipe(gulp.dest('./dist/package'));
    gulp.src(['./README.md']).pipe(gulp.dest('./dist/package'));
    gulp.src(['./src/*.js']).pipe(gulp.dest('./dist/package'));
});

gulp.task('compress', function() {
    return gulp.src('./src/*.js')
        .pipe(uglify())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('./dist/package'));
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
    gulp.src(['./site/stylesheets/*.css']).pipe(gulp.dest('./dist/pages/stylesheets'));
    gulp.src(['./site/javascripts/*.js']).pipe(gulp.dest('./dist/pages/javascripts'));
    gulp.src(['./dist/package/*.css']).pipe(gulp.dest('./dist/pages/stylesheets'));
    gulp.src(['./site/images/**']).pipe(gulp.dest('./dist/pages/images'));
    gulp.src(['./dist/package/*.js']).pipe(gulp.dest('./dist/pages/javascripts'));
    gulp.src(['./site/bower_components/highlightjs/**']).pipe(gulp.dest('./dist/pages/javascripts/highlight.js'));
    gulp.src(['./node_modules/jquery/dist/jquery.min.js']).pipe(gulp.dest('./dist/pages/javascripts'));
    gulp.src(['./node_modules/bootstrap/dist/js/bootstrap.min.js']).pipe(gulp.dest('./dist/pages/javascripts'));
    gulp.src(['./node_modules/bootstrap/dist/css/bootstrap.min.css']).pipe(gulp.dest('./dist/pages/stylesheets'));
    return gulp.src('site/pages/*.html')
        .pipe(nunjucksRender({
            path: ['site/templates/', 'dist/md/']
        }))
        .pipe(gulp.dest('dist/pages'));
});

gulp.task('pages-deploy', function() {
  return gulp.src('./dist/pages/**/*')
    .pipe(ghPages());
});


gulp.task('md', function () {
    return gulp.src('README.md')
        .pipe(markdown())
        .pipe(gulp.dest('dist/md/'));
});

gulp.task('bump', function(){
  gulp.src(['./bower.json', './package.json'])
  .pipe(bump({type:'patch'}))
  .pipe(gulp.dest('./'));
});

gulp.task('default', function(callback) {
    runSequence('clean', 'sass', 'minify-css', 'lint', 'copy', 'compress', 'md', 'pages');
});
