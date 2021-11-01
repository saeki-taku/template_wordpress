const { src, dest, watch } = require("gulp");
const loadPlugins = require("gulp-load-plugins");

const $ = loadPlugins();
const autoprefixer = require("autoprefixer");
// const cssnano = require('cssnano');
// const browserSync = require("browser-sync");
// const server = browserSync.create();

function styles() {
  return (
    src("./sass/*.scss")
      .pipe($.sourcemaps.init())
      .pipe($.sass())
      .pipe($.postcss([autoprefixer()]))
      .pipe($.sourcemaps.write(".")) //"."dest先と同じ先に出力させる為
      // .pipe($.postcss([cssnano({ safe: true, autoprefixer: false })]))
      .pipe(dest("./"))
  );
}

function startServer() {
  // server.init({
  //   server: {
  //     baseDir: "./_underscore",
  //   }
  // });
  watch("./sass/*.scss", styles); //第二引数走らせるタスク
  // watch("./sass/*.scss").on("change", server.reload);
}

exports.styles = styles;
exports.serve = startServer;
