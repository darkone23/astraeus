var gulp  = require('gulp'),
    mocha = require('gulp-mocha'),
    rjs   = require('gulp-requirejs'),
    react = require('gulp-react');

gulp.task('jsx', function() {
    return gulp.src('public/jsx/*.jsx')
        .pipe(react())
        .pipe(gulp.dest('public/js/build/jsx'));
});

gulp.task('r.js', ['jsx'], function() {
    rjs({ name: 'js/app',
          baseUrl: 'public',
          paths: {
              "react": "vendor/react/react"
          },
          out: 'js/build/rjs/app.js' })
        .pipe(gulp.dest('./public/'));
});

gulp.task('test', ['r.js'], function() {
    gulp.src('test/*.js')
        .pipe(mocha({reporter: 'nyan'}));
});

gulp.task('default', ['test']);
