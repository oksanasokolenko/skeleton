var gulp = require('gulp'),
    plumber = require('gulp-plumber'),
    scss = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    pug = require('gulp-pug'),
    watch = require('gulp-watch'),
    prefixer = require('gulp-autoprefixer'),
    uglify = require('gulp-uglify'),
    include = require('gulp-include'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    rimraf = require('rimraf'),
    browserSync = require('browser-sync'),
    reload = browserSync.reload;

path = {
    build: {
        html: 'dist/',
        pug: 'dist/',
        js: 'dist/js/',
        css: 'dist/css/',
        img: 'dist/img/',
        fonts: 'dist/fonts/',
        assets: 'dist/assets/'
    },
    src: {
        html: 'src/*.html',
        pug: 'src/*.pug',
        js: 'src/js/main.js',
        style: 'src/scss/main.scss',
        img: 'src/img/**/*.*',
        fonts: 'src/fonts/**/*.*',
        assets: 'src/assets/**/*.*'
    },
    watch: {
        html: 'src/**/*.html',
        pug: 'src/**/*.pug',
        js: 'src/js/**/*.js',
        style: 'src/scss/**/*.scss',
        img: 'src/img/**/*.*',
        fonts: 'src/fonts/**/*.*',
        assets: 'src/assets/**/*.*'
    },
    clean: './dist'
};

opts = {
    conditionals: true,
    spare:true
};

config = {
    server: {
        baseDir: './dist'
    },
    tunnel: false,
    host: 'localhost',
    port: 9000,
    logPrefix: 'Skeleton'
};

gulp.task('html:build', function() {
    gulp.src(path.src.html)
        .pipe(plumber({
            errorHandler: function (error) {
                console.log(error.message);
                this.emit('end');
            }}))
        .pipe(include())
        .pipe(gulp.dest(path.build.html))
        .pipe(reload({stream: true}))
});

gulp.task('pug:build', function() {
    gulp.src(path.src.pug)
        .pipe(plumber({
            errorHandler: function (error) {
                console.log(error.message);
                this.emit('end');
            }}))
        .pipe(pug({
            pretty: true
        }))
        .pipe(gulp.dest(path.build.pug))
        .pipe(reload({stream: true}))
});

gulp.task('style:build', function () {
    gulp.src(path.src.style)
        .pipe(plumber({
            errorHandler: function (error) {
                console.log(error.message);
                this.emit('end');
            }}))
        .pipe(sourcemaps.init())
        .pipe(scss({
            compress: true
        }))
        .pipe(prefixer())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.build.css))
        .pipe(reload({stream: true}));
});


gulp.task('js:build', function() {
    gulp.src(path.src.js)
        .pipe(plumber({
            errorHandler: function (error) {
                console.log(error.message);
                this.emit('end');
            }}))
        .pipe(include())
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.build.js))
        .pipe(reload({stream: true}))
});

gulp.task('image:build', function () {
    setTimeout(function() {
        gulp.src(path.src.img)
            .pipe(plumber({
                errorHandler: function (error) {
                    console.log(error.message);
                    this.emit('end');
                }}))
            .pipe(imagemin({
                progressive: true,
                svgoPlugins: [{removeViewBox: false}],
                use: [pngquant()],
                interlaced: true
            }))
            .pipe(gulp.dest(path.build.img)) //И бросим в build
            .pipe(reload({stream: true}));
    }, 1000);
});

gulp.task('fonts:build', function() {
    gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.build.fonts))
});

gulp.task('assets:build', function() {
    gulp.src(path.src.assets)
        .pipe(gulp.dest(path.build.assets));
});

gulp.task('build', [
    //'html:build',
    'pug:build',
    'style:build',
    'js:build',
    'image:build',
    'fonts:build',
    'assets:build'
]);

gulp.task('watch', function(){
    //gulp.watch([path.watch.html], ['html:build']);

    gulp.watch([path.watch.pug], ['pug:build']);

    gulp.watch([path.watch.style], ['style:build']);

    gulp.watch([path.watch.img], ['image:build']);

    gulp.watch([path.watch.js], ['js:build']);

    gulp.watch([path.watch.fonts], ['fonts:build']);

    gulp.watch([path.watch.assets], ['assets:build']);

});

gulp.task('webserver', function () {
    browserSync(config);
});

gulp.task('clean', function (cb) {
    rimraf(path.clean, cb);
});

gulp.task('default', ['build', 'webserver', 'watch']);