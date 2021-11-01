const { src, dest, watch, series, parallel, lastRun } = require('gulp');

const loadPlugins = require('gulp-load-plugins');

const $ = loadPlugins();
const sass = require('gulp-sass')(require('node-sass'));

const del = require('del');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');

const isProd = process.env.NODE_ENV === 'production';

function styles() {
  return src(['./src/sass/*.scss', './src//sass/**/*.scss'])
    .pipe($.if(!isProd, $.sourcemaps.init()))
    .pipe(sass())
    .pipe($.postcss([autoprefixer()]))
    .pipe($.if(!isProd, $.sourcemaps.write('.')))
    .pipe($.if(isProd, $.postcss([cssnano({ safe: true, autoprefixer: false })])))
    .pipe(dest('./css'));
}

function scripts() {
  return src(['./src/js/*.js', './src/js/**/*.js'])
    .pipe($.if(!isProd, $.sourcemaps.init()))
    .pipe(
      $.babel({
        presets: ['@babel/env'],
      })
    )
    .pipe($.if(!isProd, $.sourcemaps.write('.')))
    .pipe($.if(isProd, $.uglify()))
    .pipe(dest('./js'));
}

function lint() {
  return src(['./src/js/*.js', './src/js/**/*.js'])
    .pipe($.eslint({ fix: true }))
    .pipe($.eslint.format())
    .pipe($.eslint.failAfterError())
    .pipe(dest('./src/js'));
}

function optimizeImages() {
  return src('./src/images/**', { since: lastRun(optimizeImages) })
    .pipe($.imagemin())
    .pipe(dest('./images'));
}

function clean() {
  return del(['./css', './js', './images']);
}

function startAppServer() {
  watch(['./src/sass/*.scss", "./src/sass/**/*.scss'], styles);
  watch(['./src/js/*.js', './src/js/**/*.js'], scripts);
  watch('./src/images/**', optimizeImages);
}

const build = series(clean, parallel(optimizeImages, styles, series(lint, scripts)));
const serve = series(build, startAppServer);

exports.styles = styles;
exports.scripts = scripts;
exports.build = build;
exports.lint = lint;
exports.serve = serve;
exports.default = serve;
