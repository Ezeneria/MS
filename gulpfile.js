var gulp = require('gulp'),
    watch = require('gulp-watch'),
    prefixer = require('gulp-autoprefixer'),
    uglify = require('gulp-uglifyjs'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    rigger = require('gulp-rigger'),
    cssmin = require('gulp-minify-css'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    rimraf = require('rimraf'),
    browserSync = require("browser-sync"),
    reload = browserSync.reload;

var path = {
    dist: { //Тут мы укажем куда складывать готовые после сборки файлы
        html: 'dist/',
        js: 'dist/js/',
        css: 'dist/css/',
        img: 'dist/img/',
        php: 'dist',
        fonts: 'dist/fonts/'

    },
    app: { //Пути откуда брать исходники
        html: 'app/*.html',
        js: 'app/js/main.js',
        style: 'app/sass/main.sass',
        img: 'app/img/**/*.*',
        php: 'app/send.php',
        fonts: 'app/fonts/**/*.*'
    },
    watch: { //Указываем, за изменением каких файлов мы хотим наблюдать
        html: 'app/**/*.html',
        js: 'app/js/**/*.js',
        style: 'app/sass/**/*.sass',
        php:'app/send.php',
        img: 'app/img/**/*.*',
        fonts: 'app/fonts/**/*.*'
    },
    clean: './dist'
};

//Создадим переменную с настройками нашего dev сервера
var config = {
    server: {
        baseDir: "./dist"
    },
    tunnel: true,
    host: 'localhost',
    port: 3000
};
gulp.task('html:dist', function () {
    gulp.src(path.app.html) //Выберем файлы по нужному пути
        .pipe(rigger()) //Прогоним через rigger
        .pipe(gulp.dest(path.dist.html)) //Выплюнем их в папку build
        .pipe(reload({stream: true})); //И перезагрузим наш сервер для обновлений
});

//********************JAVASCRIPT************************
gulp.task('js:dist', function () {
    gulp.src(path.app.js) //Найдем наш main файл
        .pipe(rigger()) //Прогоним через rigger
        .pipe(sourcemaps.init()) //Инициализируем sourcemap
        .pipe(uglify()) //Сожмем наш js
        .pipe(sourcemaps.write()) //Пропишем карты
        .pipe(gulp.dest(path.dist.js)) //Выплюнем готовый файл в build
        .pipe(reload({stream: true})); //И перезагрузим сервер
});
//**************************************************

//********************STYLES************************
gulp.task('style:dist', function () {
    gulp.src(path.app.style) //Выберем наш main.scss
        .pipe(sourcemaps.init()) //То же самое что и с js
        .pipe(sass()) //Скомпилируем
        .pipe(prefixer({
            browsers: ['last 10 versions'],
            cascade: false
        })) //Добавим вендорные префиксы
        .pipe(cssmin()) //Сожмем
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.dist.css)) //И в build
        .pipe(reload({stream: true}));
});
//**************************************************

//********************IMAGES************************
gulp.task('image:dist', function () {
    gulp.src(path.app.img) //Выберем наши картинки
        .pipe(imagemin({ //Сожмем их
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()],
            interlaced: true
        }))
        .pipe(gulp.dest(path.dist.img)) //И бросим в build
        .pipe(reload({stream: true}));
});
//**************************************************

//********************FONTS************************
gulp.task('fonts:dist', function() {
    gulp.src(path.app.fonts)
        .pipe(gulp.dest(path.dist.fonts))
});
gulp.task('php:dist', function() {
    gulp.src(path.app.php)
        .pipe(gulp.dest(path.dist.php))
})
//**************************************************

//********************BUILD************************
gulp.task('build', [
    'html:dist',
    'js:dist',
    'style:dist',
    'fonts:dist',
    'php:dist',
    'image:dist'
]);
//**************************************************

//********************WATCH************************
gulp.task('watch', function(){
    gulp.watch(path.watch.html,['html:dist']);
    gulp.watch(path.watch.style, ['style:dist']);
    gulp.watch(path.watch.js,['js:dist']);
    gulp.watch(path.watch.img,['image:dist']);
    gulp.watch(path.watch.php,['php:dist']);
});

//     gulp.watch([path.watch.fonts], function(event, cb) {
//         gulp.start('fonts:dist');
//     });
// });
//**************************************************

//********************SERVER************************
gulp.task('webserver', function () {
    browserSync(config);
});
//**************************************************

//********************CLEEAN DIST*******************
gulp.task('clean', function (cb) {
    rimraf(path.clean, cb);
});
//**************************************************

//********************DEFAULT***********************
gulp.task('default', ['build', 'webserver', 'watch']);
//**************************************************