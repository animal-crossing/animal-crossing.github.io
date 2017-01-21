var gulp = require('gulp');
var concat = require('gulp-concat');
var wrap = require("gulp-wrap");
var uglify = require('gulp-uglify');

gulp.task('scripts', function() {
  return gulp.src(
  	['./public/app/**/*.js'])
    .pipe(wrap('(function(){\n"use strict";\n<%= contents %>\n})();'))
    .pipe(concat('all.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./public/js/'));
});
