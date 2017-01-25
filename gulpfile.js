/**
 * Created by eugene on 22.09.2016.
 */

/**
 * Created by eugene on 9.12.15.
 *
 * watcher -> sudo npm install --save-dev gulp-watch
 * sass -> sudo npm install --save-dev gulp-sass
 * cssmin -> sudo npm install --save-dev gulp-cssmin
 * rename -> sudo npm install --save-dev gulp-rename
 * imagemin -> sudo npm install --save-dev gulp-imagemin
 * uglify js -> sudo npm install --save-dev gulp-uglify
 * concat js -> sudo npm install --save-dev gulp-concat
 * livereload -> sudo npm install --save-dev gulp-livereload
 * gutil -> sudo npm install --save-dev gulp-util
 * concat -> sudo npm install --save-dev gulp-concat
 */

var gulp = require('gulp'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    autoprefixer = require('gulp-autoprefixer'),
    gutil = require('gulp-util'),
    cssmin = require('gulp-cssmin'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify'),
    streamify = require('gulp-streamify'),
    browserSync = require('browser-sync').create();

const vendors = ['react', 'react-dom'];

var browserify = require('browserify'),
    watchify = require('watchify'),
    source = require('vinyl-source-stream'),
    babelify = require('babelify'),
    sourceFile = 'assets/js/app.jsx';

var bundlerDev = watchify(browserify(sourceFile,{
    extensions: ['.jsx'],
    cache: {},
    packageCache: {},
    debug: true,
    poll: true,
    plugin: [watchify]
}))
    .external(vendors);

gulp.task('concat:vendor', function(){
    browserify({
        cache: {},
        packageCache: {},
        debug: true,
        poll: true
    }).require(vendors)
        
    .bundle()
    .pipe(source('vendor.js'))
    .pipe(gulp.dest('assets/js/dist'));
});

gulp.task('watch', ['sass'], function () {
    browserSync.init({
        server: "./"
    });

    bundlerDev.on('update', function(ids){
        console.log('bundling  '+ids);
        rebundle()
    });

    function rebundle() {
        return bundlerDev
        .transform('babelify', {presets: ['es2015', 'react']})
        .bundle()
        .pipe(source('bundle.js'))
        //.pipe(streamify(uglify()))
        .pipe(gulp.dest('assets/js/dist'));
    }

    gulp.watch("assets/scss/**/*.scss", ['sass']);
    gulp.watch([
        '*.html',
        'assets/js/**/*.js',
        'assets/css/**/*.css'
    ]).on('change', browserSync.reload);

    return rebundle();
});

gulp.task('default', ['concat:vendor', 'sass', 'watch']);

gulp.task('sass', function(){
   return gulp.src('assets/scss/**/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', function(e) {
            gutil.log(e);
            this.emit('end');
        })) // Using gulp-sass
        .pipe(autoprefixer({
            browsers: ['last 3 versions'],
            cascade: false
        }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('assets/css/compressed'))
});

gulp.task('uglifyjs', function() {
    gulp.src('assets/js/compressed/tween.js')
        .pipe(uglify())
        .pipe(gulp.dest('assets/js/compressed/min'));
});
















