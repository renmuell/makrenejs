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
    docs     : 'docs/**/*.*',
    test     : 'test/**/*.js'
  },
  build : {
    src      : 'build/src/makrene',
    mainJs   : 'build/src/makrene/makrene.js',
    vendorJs : 'build/src/vendorJs',
    docs     : 'build/docs',
    test     : 'build/test'
  },
  doc: {
    release : 'docs/release',
    release_src: 'release/**/*.js'
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

gulp.task('copy-docs', function(){
  return gulp.src(path.src.docs)
             .pipe(replace(/release\//g, '../src/makrene/'))
             .pipe(gulp.dest(path.build.docs));
});

gulp.task('copy-release-to-doc', ['copy-docs', 'release-js'], function(){
  return gulp.src(path.doc.release_src)
             .pipe(gulp.dest(path.doc.release));
});

// Watch

gulp.task('watch', ['build'], function(){
  gulp.watch(path.src.js      , ['build']);
  gulp.watch(path.src.docs , ['build']);
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

gulp.task('build', ['copy-docs', 'test']);

gulp.task('release', ['copy-release-to-doc']);