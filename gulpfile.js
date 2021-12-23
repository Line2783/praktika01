const { series, parallel } = require("gulp");
const { watch } = require("gulp");
const gulp = require("gulp");
const rimraf = require("rimraf");
const sass = require("gulp-sass")(require("sass"));
const pug = require("gulp-pug");
const browserSync = require("browser-sync").create();

exports.default = series(cleanBuild, buildSrc, parallel(watchSrc, sync));
exports.build = buildSrc;
exports.clean = cleanBuild;
exports.watch = watchSrc;
exports.sync = sync;

function sync() {
    browserSync.init({
        server: {
            baseDir: "dest"
        },
        files: "dest/**/*.*"
    });
}

function buildSrc(cb) {
    parallel(buildStyles, buildHtml, copyImages, copyFonts)();
    cb();
}

function cleanBuild(cb) {
    rimraf("dest", cb);
}

function buildStyles() {
    return gulp.src("src/styles/sass/style.scss")
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('dest/styles/'));
}

function cleanStyles(cb) {
    rimraf("dest/styles", cb);
}

function buildHtml() {
    return gulp.src("src/**/index.pug")
        .pipe(pug())
        .pipe(gulp.dest("dest/"));
}

function cleanHtml(cb) {
    rimraf("dest/**/*.html", cb);
}

function copyImages() {
    return gulp.src("src/img/*.*")
        .pipe(gulp.dest("dest/img"));
}

function cleanImages(cb) {
    rimraf("dest/img", cb);
}

function copyFonts() {
    return gulp.src("src/fonts/*.*")
        .pipe(gulp.dest("dest/fonts"));
}

function cleanFonts(cb) {
    rimraf("dest/fonts", cb);
}


function watchSrc() {
    watch("src/img/*.*",  series(cleanImages, copyImages));
    watch("src/fonts/*.*",  series(cleanFonts, copyFonts));
    watch("src/**/*.pug", series(cleanHtml, buildHtml));
    watch("src/styles/sass/**/*.sass", series(cleanStyles, buildStyles));
}
