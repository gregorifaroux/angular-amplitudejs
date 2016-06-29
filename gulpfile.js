/* File: gulpfile.js */

// grab our gulp packages
var gulp = require('gulp');
// Include plugins
var plugins = require("gulp-load-plugins")({
    pattern: ['gulp-*', 'gulp.*', 'main-bower-files', 'del'],
    replaceString: /\bgulp[\-.]/
});

var browserSync = require('browser-sync').create();
var reload = browserSync.reload;


// create a default task to build the app
gulp.task('default', ['jade', 'typescriptlib', 'typescript', 'bowerjs', 'bowercss', 'appcss'], function() {
    return plugins.util.log('App is built!')
});

// Jade to HTML
gulp.task('jade', function() {
    return gulp.src('src/**/*.jade')
        .pipe(plugins.jade()) // pip to jade plugin
        .pipe(gulp.dest('dist')) // tell gulp our output folder
        .pipe(browserSync.reload({
            stream: true
        }));
});

// TYPESCRIPT to JavaScript
gulp.task('typescript', function() {
    return gulp.src(['src/**/*.ts', '!src/lib'])
        .pipe(plugins.typescript({
            noImplicitAny: true,
            out: 'app.js'
        }))
        .pipe(gulp.dest('dist/example/js/'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

gulp.task('typescriptlib', function() {
    return gulp.src('src/lib/*.ts')
//    .pipe(plugins.debug())
        .pipe(plugins.typescript({
            noImplicitAny: true,
        }))
        .pipe(gulp.dest('dist/lib/'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

// BOWER
gulp.task('bowerjs', function() {

    gulp.src(plugins.mainBowerFiles())
        .pipe(plugins.filter('**/*.js'))
//        .pipe(plugins.debug())
        .pipe(plugins.concat('vendor.js'))
        .pipe(plugins.uglify())
        .pipe(gulp.dest('dist/example/js'));

});

gulp.task('bowercss', function() {
    gulp.src(plugins.mainBowerFiles())
        .pipe(plugins.filter('**/*.css'))
//        .pipe(plugins.debug())
        .pipe(plugins.concat('vendor.css'))
        .pipe(gulp.dest('dist/example/css'));

});

// APP css
gulp.task('appcss', function() {
    return gulp.src('src/css/**/*.css')
        .pipe(gulp.dest('dist/example/css/'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

// CLEAN
gulp.task('clean', function(done) {
    var delconfig = [].concat(
        'dist',
        '.tmp/js'
    );

    // force: clean files outside current directory
    plugins.del(delconfig, {
        force: true
    }, done);
});

// Watch scss AND html files, doing different things with each.
gulp.task('serve', ['default'], function() {
  var files = [
     'dist/**/*.html',
     'dist/index.html',
     'src/**/*.css',
//     'src/**/*.ts',
     'dist/**/*.js',
  ];

  gulp.watch("src/**/*.ts", ['typescript']).on("change", reload);
  gulp.watch("src/**/*.jade", ['jade']).on("change", reload);

  browserSync.init(files, {
     server: {
        baseDir: './dist/',
        index: 'example/index.html'
     }
  });
});
