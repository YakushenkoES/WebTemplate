const {
  series,
  parallel
} = require('gulp');
const gulp = require('gulp');
const lessGulp = require('gulp-less');
const autoprefixer = require("gulp-autoprefixer");
const sourcemaps = require('gulp-sourcemaps');
const browserSync = require('browser-sync').create();
const del = require('del');
const clean_css = require('gulp-clean-css');
var rename = require("gulp-rename");

const outDir = './dist';
const paths = {
  html: 'src/*.html',
  less: 'src/less/**/*.less',
  css: 'src/css/**/*.css',
  cssDir: 'src/css',
  js: 'src/js/*.js',
  jsDir: 'src/js',


  fonts: 'src/fonts/**/*.*'
};


// Browser-sync _____________________________
function initBrowserSync(done) {
  browserSync.init({
    server: {
      baseDir: "./src"
    }
  });
  done();
}

function reload(done) {
  browserSync.reload();
  done();
}


// LESS_______________________________________
function less() {
  return gulp.src([paths.less, '!**/_*.less'])
    .pipe(lessGulp())
    .pipe(autoprefixer(['> 0.1%'], {
      cascade: true,
      grid: true
    }))
    .pipe(gulp.dest(paths.cssDir))
    .pipe(browserSync.stream());
}

// Clean CSS____________
function prepareCSS() {
  return gulp.src([paths.less, '!**/_*.less'])
    .pipe(sourcemaps.init())

    .pipe(lessGulp())
    .pipe(autoprefixer(['> 0.1%'], {
      cascade: true,
      grid: true
    }))
    .pipe(gulp.dest(paths.cssDir))
    .pipe(clean_css({
      level: 2
    }))
    .pipe(rename({
      extname: ".min.css"
    }))

    .pipe(sourcemaps.write('/maps'))
    .pipe(gulp.dest(paths.cssDir))
    .pipe(browserSync.stream());
}


// Watch_____________________________________
function watchFiles() {
  gulp.watch(paths.html, reload);
  gulp.watch(paths.js, reload);
  gulp.watch(paths.less,prepareCSS);
};
const watch = series(less, initBrowserSync, watchFiles);



// BUILD__________________________________
function clean(done) {
  del.sync(outDir);
  done();
}

function buildProject(done) {

  // HTML
  gulp.src(paths.html)
    .pipe(gulp.dest(outDir));

  // CSS
  gulp.src([paths.css, '!src/css/style.css'])
    .pipe(gulp.dest(outDir + '/css'));

  // JS
  gulp.src(paths.js)
    .pipe(gulp.dest(outDir + '/js'));

  // FONTS
  gulp.src(paths.fonts, {
      base: "./src"
    })
    .pipe(gulp.dest(outDir));

  // LIBS
  gulp.src(['src/libs/**/*.*', '!src/libs/bootstrap/**', 'src/libs/bootstrap/dist/css/bootstrap-grid.min.css'], {
      base: "./src"
    })
    .pipe(gulp.dest(outDir));

  // IMG
  gulp.src('src/img/**/*.*', {
      base: "./src"
    })
    .pipe(gulp.dest(outDir));

  done();
}
const build = series(clean, prepareCSS, buildProject);


exports.default = watch;
exports.build = build;
exports.css = prepareCSS;