// gulp v.3

var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync');
var concat = require('gulp-concat');
var uglify = require('gulp-uglifyjs');
var cssnano = require('gulp-cssnano');
var rename = require('gulp-rename');
var del = require('del');
var imagemin = require('gulp-imagemin');
var pngQuant = require('imagemin-pngquant');
var cache = require('gulp-cache');
var autoprefixer = require('gulp-autoprefixer');
//var rigger = require("gulp-rigger");
var fileinclude = require("gulp-file-include");


// Сборка html
gulp.task('html-rigger', function () {
    gulp.src('src/html/*.html')
        .pipe(rigger())
        .pipe(gulp.dest('src'));
});
gulp.task('html', function () {
    gulp.src('src/html/*.html')
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file',
            indent: true
        }))
        .pipe(gulp.dest('src'));
});


gulp.task('sass', function(){
    return gulp.src('src/scss/**/*.scss') //'src/sass/**/*.sass' // ! - исключение из выборки // [!'src/sass/main.sass', 'src/sass/**/*.sass' ] массив (все кроме)     // + (sass/scss)
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer(['cover 99.5%', 'cover 99.5% in RU', '> 1%', 'ie 8', 'ie 7'],{cascade: true})) // Префиксы 
    .pipe(gulp.dest("src/css"))
    .pipe(browserSync.reload({stream: true}) // Обновляем CSS на странице при изменении
    );
});

// Соединение и минификаци js npm i gulp-concat i  gulp-uglifyjs
gulp.task('scripts', function(){
    return gulp.src([
         "src/libs/jquery/dist/jquery.min.js",
         "src/libs/magnific-popup/dist/jquery.magnific-popup.min.js"
        ])
        .pipe(concat("libs.min.js"))
        .pipe(uglify())
        .pipe(gulp.dest('src/js'))
        ;
});

// Сжатие css (npm i gulp-cssnano gulp-rename --save-dev)
gulp.task('css-libs',['sass'] ,function(){
    return gulp.src("src/css/libs.css")
    .pipe(cssnano())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('src/css'))
    ;

});

 //Live reload //npm install  browser-sync --save-dev

gulp.task('browser-sync', function() { // Создаем таск browser-sync
    browserSync({ // Выполняем browser Sync
        server: { // Определяем параметры сервера
            baseDir: 'src' // Директория для сервера - src
        },
        notify: false // Отключаем уведомления
    });
});


// Чистить папку dist (npm i del --save-dev удаление старых файлов)
gulp.task('clean', function(){
    return del.sync('dist');
});

// Очистка кэша (для картинок) для ручной чистки
gulp.task('clear', function(){
    return cache.clearAll();
});

// Следить за изменениями в файлах
gulp.task('watch', ['browser-sync', 'css-libs', 'scripts','html'], function(){
    gulp.watch('src/html/**/*.html',['html']);
    gulp.watch('src/scss/**/*.scss',['sass']);
    gulp.watch('src/*.html', browserSync.reload);
    gulp.watch('src/js/**/*.js', browserSync.reload);
   
});

// Подготовка изображений (npm i --save-dev gulp-imagemin imagemin-pngquant    npm i gulp-cache --save-dev)
gulp.task('img', function(){
    return gulp.src("src/img/**/*")
    .pipe(cache(imagemin(
        {
            interlaced: true,
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngQuant]
        }
    )))
    .pipe(gulp.dest("dist/img"));
});




// Сборка  
gulp.task('build',['clean', 'img', 'sass', 'scripts','html'], function(){

    var buildCss = gulp.src([
        'src/css/main.css',
        'src/css/libs.min.css',
    ])
    .pipe(gulp.dest('dist/css')) ;

    var buildFonts = gulp.src([
        'src/fonts/**/*'
    ])
    .pipe(gulp.dest('dist/fonts'));

    var buildJs = gulp.src([
        'src/js/**/*'
    ])
    .pipe(gulp.dest('dist/js'));

    var buildHtml = gulp.src([
        'src/*.html'
    ])
    .pipe(gulp.dest('dist'));



});

gulp.task('default', ['watch']);
