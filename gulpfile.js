const gulp = require('gulp');
const {series, src} = require('gulp');
const purgecss = require('gulp-purgecss');
const cleancss = require("gulp-clean-css");
const replace = require('gulp-replace');
const sharpResponsive = require("gulp-sharp-responsive");

//remove unused styles
function unusedcss() {
    const css = [
        'wp-content/themes/govuk-gds_wordpress_theme/assets/css/*.css',
        'wp-content/plugins/enlighter/cache/*.css',
        // 'wp-content/plugins/github-embed/css/*.css',
        // 'wp-content/plugins/islays-tools/public/css/*.css',
        'wp-includes/css/dist/block-library/*.css'
    ];
    return gulp.src(css)
        .pipe(purgecss({
            content: ['*.html']
        }))
        .pipe(gulp.dest('styles/css/'))
}

gulp.task('unusedcss');

//minify styles
function minifycss() {
    return (
        gulp
            .src("styles/css/*.css")
            .pipe(cleancss())
            .pipe(gulp.dest("styles/css/"))
    );
}

gulp.task('minifycss');

// function convertToWebp() {
//     return (
//         gulp
//             .src('wp-content/uploads/2022/09/*.jpeg')
//             .pipe(sharpResponsive({
//                 formats: [
//                     {width: 640, format: "webp"}
//                 ]
//             }))
//             .pipe(gulp.dest('webp/'))
//     )
// }

const convertToWebp = () => src("wp-content/uploads/2022/09/*.jpeg")
    .pipe(sharpResponsive({
        formats: [
            {width: 640, format: "webp"}
        ]
    }))
    .pipe(gulp.dest('webp/'))


gulp.task('convertToWebp');


function replaceOldStyle() {
    return (
        gulp
            .src(['*.html', '*/*.html', '*/*/*.html', '*/*/*/*.html', '*/*/*/*/*.html', '*/*/*/*/*/*.html', '*/*/*/*/*/*/*.html'])
            .pipe(replace('href="/wp-content/themes/govuk-gds_wordpress_theme/assets/css/', 'href="/styles/css/'))
            .pipe(replace('href="/wp-content/plugins/enlighter/cache/', 'href="/styles/css/'))
            //.pipe(replace('href="/wp-content/plugins/github-embed/css/', 'href="/styles/css/'))
            //.pipe(replace('href="/wp-content/plugins/islays-tools/public/css/', 'href="/styles/css/'))
            .pipe(replace('href="/wp-includes/css/dist/block-library/', 'href="/styles/css/'))
            .pipe(replace('/wp-includes/js/jquery/jquery.min.js', ''))
            .pipe(replace('/wp-includes/js/jquery/jquery-migrate.min.js', ''))
            .pipe(replace(/(:?href="(?:([_a-zA-Z\d.\/-]{1,99})(\?[_a-zA-Z\d.\/-]{1,99}=[_a-zA-Z\d.\/-]{1,99}))" )/img, 'href="$2" '))
            .pipe(replace(/type="[a-zA-Z\d]{1,99}-text\/javascript"/gm, 'type="text/javascript"'))
            // .pipe(replace(".jpeg", '.webp'))
            // .pipe(replace(".jpg", '.webp'))
            // .pipe(replace(".png", '.webp'))
            .pipe(gulp.dest('.'))
    )
}

gulp.task('replaceOldStyle');


//build

exports.build = series(unusedcss, minifycss, convertToWebp, replaceOldStyle);