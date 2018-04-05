var gulp = require('gulp'),
    sass = require('gulp-sass'),
    browserSync = require('browser-sync'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglifyjs'),
    cssnano = require('gulp-cssnano'),
    rename = require('gulp-rename');

gulp.task('sass',function () {
   return gulp
       .src('app/sass/**/*.sass')
       .pipe(sass())
       .pipe(gulp.dest('app/css/'))
       .pipe(browserSync.reload({stream: true}))
});

gulp.task('sass-concat',function () {
   return gulp.src('app/sass/**/*.sass')
       .pipe(concat('styles.sass'))
       .pipe(gulp.dest('app/css'))
});

gulp.task('browser-sync',function () {
   browserSync({
       server:{
          baseDir:'app'
       },
       notify: false
   })
});

gulp.task('watch', ['browser-sync','sass','sass-concat'],function () {
   gulp.watch('app/sass/**/*.sass',['sass']);
    gulp.watch('app/js/*.js',browserSync.reload);
    gulp.watch('app/*.html',browserSync.reload);
});

gulp.task('build',function () {

});