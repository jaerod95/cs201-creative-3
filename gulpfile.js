var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();

gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: "./"
        },
    });
});

gulp.task('sass', function() {
    return gulp.src('assets/css/sass/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('assets/css'))
        .pipe(browserSync.reload({ stream: true }));
});

gulp.task('reload', () => {
    browserSync.reload();
})

gulp.task('sass:watch', () => {
    gulp.watch('assets/css/sass/**/*.scss', ['sass']);
});

gulp.task('watch', () => {
    gulp.watch(['./**/*.js', './**/*.html', './**/*.css'], ['reload']);
});

gulp.task("default", ['browser-sync', 'sass', 'sass:watch', 'watch']);