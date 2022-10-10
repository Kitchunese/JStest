const {src, dest, series, watch} = require('gulp');
const concat = require('gulp-concat');
const htmlmin = require('gulp-htmlmin');
const autoprefix = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const svgSprite = require('gulp-svg-sprite');
const browserSync = require('browser-sync').create();
const image = require('gulp-image');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify-es').default;
const notify = require('gulp-notify');
const sourceMapc = require('gulp-sourcemaps');

//создаем такс (задачу) для стилей
const styles = () => {
    return src('src/style/**/*.css')
        .pipe(sourceMapc.init())
        .pipe(concat('style.css'))
        .pipe(autoprefix('last 5 versions'))
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(dest('dist'))
        .pipe(sourceMapc.write())
        .pipe(browserSync.stream())
} 
//создаем таск (задачу) для html
const htmlMinify = () => {
    return src('src/**/*.html')
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(dest('dist'))
        .pipe(browserSync.stream())
}

const svgSprites = () => {
    return src('src/images/svg/**/*.svg')
        .pipe(svgSprite({
            mode:{
                stack:{
                    sprite: '../sprite.svg'
                }
            }
        }))
        .pipe(dest('dist/images'))
        .pipe(browserSync.stream());
}

const images = () => {
    return src ([
        'src/images/**/*.jpg',
        'src/images/**/*.jpeg',
        'src/images/**/*.png',
        'src/images/*.svg',
    ])
    .pipe(image())
    .pipe(dest('images'))
    .pipe(browserSync.stream())
}

const scripts = () =>{
    return src([
        'src/js/components/**/*.js',
        'src/js/main.js'
    ])
    .pipe(sourceMapc.init())
    .pipe(sourceMapc.write())
    .pipe(babel({
        presets:['@babel/env']
    }))
    .pipe(concat('app.js'))
    .pipe(uglify({
        toplevel:true
    }).on('error',notify.onError()))
    .pipe(uglify().on('error', notify.onError()))
    .pipe(dest('dist'))
    .pipe(browserSync.stream())
}

const watchFile = () => {
    browserSync.init({
        server:{
            baseDir:'dist'
        }
    })
}

const resourse = () =>{
    return src('src/resources/**')
        .pipe(dest('dist'))
}

watch('src/**/*.html', htmlMinify);
watch('src/style/**/*.css',styles);
watch('src/images/svg/**/*.svg', svgSprites);
watch([
    'src/images/**/*.jpg',
    'src/images/**/*.jpeg',
    'src/images/**/*.png',
    'src/images/*.svg',
],images);
watch('src/resourses/**',resourses);
watch('src/js/**/*.js',scripts);
//экпорт тасков (задач)
// exports.styles = styles;
// exports.html = htmlMinify;
exports.scripts=scripts;
exports.default = series(styles, htmlMinify,svgSprites, images, scripts, watchFile);
