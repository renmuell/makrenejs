var gulp       = require('gulp');
var uglify     = require('gulp-uglify');
var rename     = require('gulp-rename');
var eslint     = require('gulp-eslint');
var replace    = require('gulp-replace');
var sourcemaps = require('gulp-sourcemaps');
var browserify = require('gulp-browserify');
var tape       = require('gulp-tape');

// path

var path = {
  src : {
    js       : 'src/makrene/**/*.js',
    vendorJs : 'src/vendorJs/**/*.js',
    example  : 'example/**/*.*',
    test     : 'test/**/*.js'
  },
  build : {
    src      : 'build/src/makrene',
    mainJs   : 'build/src/makrene/makrene.js',
    vendorJs : 'build/src/vendorJs',
    example  : 'build/example',
    test     : 'build/test'
  },
  release : {
    main    : 'release/'
  }
};

// Error

function onError(e) {
  console.error(e);
  this.emit('end');
}

// Build JS

gulp.task('build-js', function(){
  return gulp.src(path.src.js)
             .pipe(eslint())
             .pipe(eslint.formatEach())
             //.pipe(eslint.failAfterError())
             .on('error', onError)
             .pipe(gulp.dest(path.build.src));
});

gulp.task('bundle-js', ['build-js', 'copy-vendorjs'], function(){
  return gulp.src(path.build.mainJs)
             .pipe(browserify({
               standalone: 'Makrene',
               read: false
             }))
             .on('error', onError)
             .pipe(gulp.dest(path.build.src));
});

// Release JS

gulp.task('release-js', ['test'], function(){
  return gulp.src(path.build.mainJs)
             .on('error', onError)
             .pipe(gulp.dest(path.release.main))
             .pipe(sourcemaps.init())
             .pipe(uglify().on('error', function(e){
                console.log(e);
             }))
             .pipe(rename({
                 suffix: "-min"
              }))
             .pipe(sourcemaps.write('./'))
             .pipe(gulp.dest(path.release.main));
});

// Build vendor js

gulp.task('copy-vendorjs', function(){
  return gulp.src(path.src.vendorJs)
             .pipe(gulp.dest(path.build.vendorJs));
});

// Copy Example to build

gulp.task('copy-example', function(){
  return gulp.src(path.src.example)
             .pipe(replace(/\/release\//g, '/src/makrene/'))
             .pipe(gulp.dest(path.build.example));
});

// Watch

gulp.task('watch', ['build'], function(){
  gulp.watch(path.src.js      , ['build']);
  gulp.watch(path.src.example , ['build']);
  gulp.watch(path.src.test    , ['build']);
});

// Test

gulp.task('test',  ['bundle-js'],function() {
  return gulp.src(path.src.test)
    .pipe(eslint())
    .pipe(eslint.formatEach())
    //.pipe(eslint.failAfterError())
    .on('error', onError)
    .pipe(tape({
      nyc: true,
      bail: true
    }));
});

// ALL

gulp.task('default', ['build']);

gulp.task('build', ['copy-example', 'test']);

gulp.task('release', ['copy-example', 'release-js']);