const { src, dest, watch, series } = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const postcss = require("gulp-postcss");
const cssnano = require("cssnano");
const terser = require("gulp-terser");
const browsersync = require("browser-sync").create();
const gzip = require("gulp-gzip");

// Sass Task
function scssTask() {
  return (
    src("assets/scss/**/*.scss", { sourcemaps: true })
      .pipe(sass())
      .pipe(postcss([cssnano()]))
      //.pipe(gzip())
      .pipe(dest("dist", { sourcemaps: "." }))
  );
}

// JavaScript Task
function jsTask() {
  return (
    src("assets/js/**/*.js", { sourcemaps: true })
      .pipe(terser())
      //.pipe(gzip())
      .pipe(dest("dist", { sourcemaps: "." }))
  );
}

// Browsersync Tasks
function browsersyncServe(cb) {
  browsersync.init({
    server: {
      baseDir: ".",
    },
  });
  cb();
}

function browsersyncReload(cb) {
  browsersync.reload();
  cb();
}

// Watch Task
function watchTask() {
  watch("*.html", browsersyncReload);
  watch(
    ["assets/scss/**/*.scss", "assets/js/**/*.js"],
    series(scssTask, jsTask, browsersyncReload)
  );
}

// Default Gulp task
exports.default = series(scssTask, jsTask, browsersyncServe, watchTask);
