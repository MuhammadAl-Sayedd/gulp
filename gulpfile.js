const { src, dest , series ,parallel , watch } = require("gulp");
const htmlmin = require("gulp-htmlmin");
const globs = {
    html :"task/*.html",
    js: "task/js/*.js",
    css: 'task/css/*.css',
    img: 'task/images/*'
}

// html task
function htmlTask() {
  //1-read html file
  //2-minify html file
  //3-copy to dist folder
  return src(globs.html)
    .pipe(htmlmin({ collapseWhitespace: true, removeComments: true }))
    .pipe(dest("dist"));
}

exports.htmlnew = htmlTask;

//js task
var concat = require("gulp-concat");
const terser = require("gulp-terser");
function jsTask() {
 return src(globs.js).pipe(concat("script.min.js")).pipe(terser()).pipe(dest('dist/assets'));
}

exports.jsnew = jsTask

//css task
const cleanCSS = require('gulp-clean-css');
function cssTask() {
    return src(globs.css).pipe(concat('style.min.css')).pipe(cleanCSS()).pipe(dest('dist/assets'))
}

exports.cssnew= cssTask

//images task
const imagemin = require('gulp-imagemin');
function imgTask() {
    return src(globs.img).pipe(imagemin()).pipe(dest('dist/images'))
}

exports.imgnew = imgTask

var browserSync = require('browser-sync')
function serve(callback) {
    browserSync({
        server:{
            baseDir:'dist'
        }
    })
    callback()
}

//reload task

function reloadTask(done) {
    browserSync.reload()
    done()
}

// watch task

function watchTask() {
    watch(globs.html,series(htmlTask,reloadTask))
    watch(globs.js,series(jsTask,reloadTask))
    watch(globs.css,series(cssTask,reloadTask))
    watch(globs.img,series(imgTask,reloadTask))
}

exports.default = series(parallel(htmlTask,cssTask,jsTask,imgTask),serve,watchTask)