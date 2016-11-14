//Gulpfile created by rmach
//TODO: Uglify
//TODO: babel or not ?
//TODO: ajouter un linter

var gulp = require('gulp');
var util = require('gulp-util');
var nodemon = require('gulp-nodemon');
gulp.task('build', ['build-client']);


gulp.task('build-client', function () {
    return gulp.src(['app/hostController.js'])
        .pipe(gulp.dest('bin/'));
});


gulp.task('run', ['build'], function () {
    nodemon({
        delay: 10,
        script: './hostController.js',
        cwd: "./bin/",
        ext: 'html js css'
    })
        .on('restart', function () {
            util.log('Tracker restarted!');
        });
});


gulp.task('default', ['run']);
