var browserSync = require('browser-sync').create(),
    concat = require('gulp-concat'),
    cssnano = require('gulp-cssnano'),
    del = require('del'),
    gulp = require('gulp'),
    gulpIf = require('gulp-if'),
    imagemin = require('gulp-imagemin'),
    jshint = require('gulp-jshint'),
    ngAnnotate = require('gulp-ng-annotate'),
    prefixer = require('gulp-autoprefixer'),
    runSequence = require('run-sequence'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    stylish = require('jshint-stylish'),
    uglify = require('gulp-uglify'),
    cssMin = require('gulp-css'),
    stripDebug = require('gulp-strip-debug')
    useref = require('gulp-useref');


gulp.task('default',['watch'], function()
{

});

gulp.task('compile_sass',function()
{
    return gulp.src('app/scss/**/*.scss')
        .pipe(sass())
        .pipe(prefixer({browsers:['last 2 versions', 'ios_saf >=5', 'safari >=7']}))
        .pipe(gulp.dest('app/css/'))
        .pipe(browserSync.stream());
});


gulp.task('watch',['browser_Sync', 'compile_sass','checkJs'], function()
{
    gulp.watch('app/scss/**/*.scss', ['compile_sass']);
    gulp.watch('app/**/*.html', browserSync.reload);
    gulp.watch('app/scripts/*.js', ['checkJs']);
});

gulp.task('checkJs',function()
{
    return gulp.src('app/scripts/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter(stylish))
        .pipe(browserSync.stream());
});


gulp.task('browser_Sync',function()
{
    browserSync.init(
        {
            server:{baseDir:'app/'}
        });
});







//***************BUILD TASKS

gulp.task('clean', function()
{
    return del(['../build'],{force:true});
});


//concatenating and minifying javascript libraries and native scripts
gulp.task('js', function () {
    gulp.src([
        '../app/bower_components/jquery/dist/jquery.js',
        '../app/bower_components/angular/angular.js',
        '../app/bower_components/angular-ui-router/release/angular-ui-router.js',
         '../app/bower_components/angular-sanitize/angular-sanitize.js'])
        .pipe(sourcemaps.init())
        .pipe(concat('libs.js'))
        .pipe(ngAnnotate())
        .pipe(uglify())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('../build/scripts'));
});



gulp.task('myscripts', function()
{
    gulp.src([
        '../app/scripts/*.js']) 
        .pipe(sourcemaps.init())
        .pipe(concat('myscripts.js'))
        .pipe(stripDebug())
        .pipe(ngAnnotate())
        .pipe(uglify())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('../build/scripts'));
})





gulp.task('browser_Sync_build', function()
{
    browserSync.init(
        {
            server:{baseDir:'../build'}
        });
    browserSync.reload;
});

//copy items
gulp.task('copy_html', function()
{
    gulp.src(['../app/views/*.html'])
    .pipe(gulp.dest('../build/views'));

});

gulp.task('copy_images', function()
{
        gulp.src('../app/media/**/*.+(png|jpg|gif|svg|ico)')
        .pipe(imagemin())
        .pipe(gulp.dest('../build/media'));
});

gulp.task('copy_bowercomponents', function()
{
    gulp.src('../app/bower_components/**/*')
    .pipe(gulp.dest('../build/bower_components'));
})

//compressing and concatenating css
gulp.task('compress_css_build',['compile_sass_build'], function()
{
    gulp.src([
        '../app/css/style.css',
        '../app/css/mediaqueries.css'
        ])
    .pipe(concat('styles.css'))
    .pipe(cssMin())
    .pipe(gulp.dest('../build/css'));
})

gulp.task('compile_sass_build',function()
{
    return gulp.src('../app/scss/**/*.scss')
        .pipe(sass())
        .pipe(prefixer({browsers:['last 2 versions', 'ios_saf >=5', 'safari >=7']}))
        .pipe(gulp.dest('../app/css/'))
});

//changes the references in index.html
gulp.task('useref', function()
{
    gulp.src('../app/index.html')
    .pipe(useref({noAssets:true}))
    .pipe(gulp.dest('../build'));
})

gulp.task('build',function(callback)
{
    runSequence('clean',['copy_html','useref','compress_css_build','copy_bowercomponents','js','myscripts','copy_images'],callback)
});
