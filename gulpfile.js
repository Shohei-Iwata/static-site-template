const gulp = require('gulp');
const plumber = require('gulp-plumber');
const ejs = require('gulp-ejs');
const rename = require('gulp-rename');
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const styleLint = require('stylelint');
const webpackStream = require('webpack-stream');
const webpackConfig = require('./webpack.config.js');
const webpack = require('webpack');
const browserSync = require('browser-sync');

const src = {
  root: 'src/docroot',
  ejs: ['src/docroot/**/*.ejs', '!src/docroot/**/_*.ejs'],
  scss: 'src/docroot/**/*.scss',
  ts: 'src/docroot/**/*.ts'
};

const dest = {
  root: 'dist/',
  files: 'dist/**/*',
  js: 'dist/js/'
}

// ejs
function ejsCompile() {
  return gulp.src(src.ejs)
    .pipe(plumber())
    .pipe(ejs({}, {}, { ext: '.ejs' }))
    .pipe(rename({ extname: '.html' }))
    .pipe(gulp.dest(dest.root))
}

// scss
function sassCompile() {
  return gulp.src(src.scss)
    .pipe(postcss([
      autoprefixer(),
      styleLint({
        fix: true
      })
    ]))
    .pipe(sass({
      outputStyle: 'expanded'
    })).on('error', sass.logError)
    .pipe(gulp.dest(dest.root));
}

// webpack & TypeScript
function tsCompile(cb) {
  webpackStream(webpackConfig, webpack)
    .pipe(plumber())
    .pipe(gulp.dest(dest.js));
  cb();
}

// browser start
function browserStart(cb) {
  browserSync.init({
    server: {
      baseDir: dest.root,
      index: 'index.html'
    }
  });
  cb();
}

// browser reload
function browserReload(cb) {
  browserSync.reload();
  cb();
}

// watch tasks
function watchFiles(cb) {
  gulp.watch(src.ejs, ejsCompile);
  gulp.watch(src.scss, sassCompile);
  gulp.watch(src.ts, tsCompile);
  gulp.watch(dest.files, browserReload);
  cb();
}

exports.build = gulp.parallel(
  ejsCompile,
  sassCompile,
  tsCompile
);
exports.default = gulp.parallel(
  browserStart,
  ejsCompile,
  sassCompile,
  tsCompile,
  browserReload,
  watchFiles
);