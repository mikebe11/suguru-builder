const { src, dest, watch, series, parallel } = require('gulp');
const sass = require('gulp-sass');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const rename = require('gulp-rename');
const header = require('gulp-header');

const today = new Date();

const builderJSFiles = [
    './src/js/dimensions.js',
    './src/js/buttons.js',
    './src/js/cell.js',
    './src/js/image_picker.js'
];

const dateString = '/* generated on ' +
    (today.getMonth() + 1) + '/' +
    today.getDate() + '/' +
    today.getFullYear() + ' */' + '\r\n';


function builderCSS(error) {
    return src('./src/css/builder.scss')
        .pipe(sass({outputStyle: 'compressed'}))
        .pipe(header(dateString))
        .pipe(rename('builder.min.css'))
        .pipe(dest('./dist'));
}

function builderCSSwatch() {
    watch('./src/css/builder.scss', series('builderCSS'));
}

function builderJS(error) {
    return src(builderJSFiles)
        .pipe(concat('builder.min.js'))
        .pipe(uglify())
        .pipe(header(dateString))
        .pipe(dest('./dist'));
}

function builderJSwatch() {
    watch(builderJSFiles, series('builderJS'));
}

function builderConcatVendorJS() {
    return src([
        './src/js/vendor/jquery-*.min.js',
        './src/js/vendor/jquery-ui.min.js',
        './src/js/vendor/underscore-min.js',
        './src/js/vendor/backbone-min.js'
    ])
        .pipe(concat('vendor-bundle.min.js'))
        .pipe(dest('./dist'));
}


exports.css = builderCSS;
exports.watchCSS = builderCSSwatch;
exports.js = builderJS;
exports.watchJS = builderJSwatch;
exports.vendor = builderConcatVendorJS;
exports.default = parallel(builderCSS, builderJS, builderConcatVendorJS);