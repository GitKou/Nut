const commonConfig = require('../../gulpfile');
const gulp = require('gulp');

gulp.task('esLess', function () {
  return gulp.src(['src/**/*.less']).pipe(gulp.dest('es/'));
});

gulp.task('libLess', function () {
  return gulp.src(['src/**/*.less']).pipe(gulp.dest('lib/'));
});

exports.default = gulp.series(commonConfig.default, 'esLess', 'libLess');
