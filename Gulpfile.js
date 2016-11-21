const gulp = require('gulp');
const babel = require('gulp-babel');

gulp.task('transpile', () => {
    return gulp.src('src/spinnable.js')
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(gulp.dest('dist'));
});
