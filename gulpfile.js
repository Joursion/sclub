var gulp = require('gulp');
var browserify = require('gulp-browserify');
var uglify = require('gulp-uglify');
var minify = require('gulp-clean-css');


gulp.task('css', function () {
     gulp.src('./view/publices/css/*.css')
    .pipe(minify())
    .pipe(gulp.dest('./dest'));
});

gulp.task('js', function () {
    gulp.src('./view/publices/js/*.js')
    .pipe(minify())
    .pipe(gulp.dest('./dest'));
});


gulp.task('css auto', function () {
    gulp.watch('./view/publices/css/*.css', ['css']);
});

gulp.task('js auto', function () {
    gulp.watch('./view/publices/js/*.js', ['js']);
});




gulp.task('default',['css', 'css auto', 'js', 'js auto']);