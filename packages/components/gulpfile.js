const commonConfig = require('../../gulpfile');
const gulp = require('gulp');

gulp.task('less', function () {
  return gulp.src(['src/**/*.less']).pipe(gulp.dest('es/'));
});

exports.default = gulp.series(commonConfig.default, 'less');
