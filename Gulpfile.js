const gulp = require('gulp');
const babel = require('gulp-babel');
const watch = require('gulp-watch');
const minify = require('gulp-minify');

gulp.task('transpile', () => {
    gulp.src('src/spinnable.js')
    .pipe(babel({
        presets: ['es2015']
    }))
    .pipe(minify({
        ext: {
            src:'.js',
            min:'.min.js',
        },
    }))
    .pipe(gulp.dest('dist'));
});
