const gulp = require('gulp');
const {series, src} = require('gulp');
const purgecss = require('gulp-purgecss');
const cleancss = require("gulp-clean-css");
const replace = require('gulp-replace');
const sharpResponsive = require("gulp-sharp-responsive");

//remove unused styles
function unusedcss() {
    const css = ['wp-*/**/*.css'];
    return gulp.src(css)
        .pipe(purgecss({
            content: ['**/*.html'],
            safelist: {
                standard: [/^enlighter-/],
            }
        }))
        .pipe(gulp.dest('.'))
}

gulp.task('unusedcss');

//minify styles
function minifycss() {
    return (
        gulp
            .src("**/*.css")
            .pipe(cleancss())
            .pipe(gulp.dest('.'))
    );
}

gulp.task('minifycss');


function replaceOldStyle() {
    return (
        gulp
            .src(['*.html', '**/*.html'])
            .pipe(replace('/wp-includes/js/jquery/jquery.min.js', ''))
            .pipe(replace('/wp-includes/js/jquery/jquery-migrate.min.js', ''))
            .pipe(replace('<img ', '<img loading="lazy" '))
            .pipe(gulp.dest('.'))
    )
}

gulp.task('replaceOldStyle');


//build

exports.build = series(unusedcss, minifycss, replaceOldStyle);