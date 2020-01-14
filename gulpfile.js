var gulp          = require('gulp'),
	sass          = require('gulp-sass'),
	browserSync   = require('browser-sync'),
	cleancss      = require('gulp-clean-css'),
	rename        = require('gulp-rename'),
	autoprefixer  = require('gulp-autoprefixer'),

	imagemin      = require('gulp-imagemin'),
	imageminJpegRecompress = require('imagemin-jpeg-recompress'),
	pngquant 	  = require('imagemin-pngquant'),
	cache 		  = require('gulp-cache'),
	fileinclude   = require('gulp-file-include'),
	gzip 		  = require('gulp-gzip'),

	notify        = require('gulp-notify');

// Local Server
gulp.task('browser-sync', function() {
	browserSync({
		server: {
			baseDir: 'app'
		},
		notify: false,
		// open: false,
		// online: false, // Work Offline Without Internet Connection
		// tunnel: true, tunnel: "projectname", // Demonstration page: http://projectname.localtunnel.me
	});
});

// Scss Styles
gulp.task('styles', function() {
	return gulp.src('app/scss/**/*.scss')
	.pipe(sass({ outputStyle: 'expanded' }).on("error", notify.onError()))
	.pipe(rename({ suffix: '.min', prefix : '' }))
	.pipe(autoprefixer(['last 15 versions']))
	.pipe(cleancss( {level: { 1: { specialComments: 0 } } })) // Opt., comment out when debugging
	.pipe(gulp.dest('app/css'))
	.pipe(browserSync.stream());
});

// Compress images
gulp.task('imagemin', function() {
    return gulp.src('app/img/**')
		.pipe(imagemin([
		    imagemin.gifsicle({interlaced: true}),
		    imagemin.jpegtran({progressive: true}),
		    imageminJpegRecompress({
				loops: 5,
				min: 65,
				max: 70,
				quality: 'medium'
		    }),
		    imagemin.optipng({optimizationLevel: 3}),
		    pngquant({quality: [0.65, 0.7], speed: 5}),
		    imagemin.svgo({
		        plugins: [
		            {removeViewBox: true},
		            {cleanupIDs: false}
		        ]
		    })
		],
		{
			verbose: true
		}))
        .pipe(gulp.dest('app/img_compressed'));
});
// Clearing the cache
gulp.task('clear', function(done) {
	return cache.clearAll(done);
});
// Compress images
gulp.task('images', gulp.parallel('imagemin', 'clear'));

// Gzip
gulp.task('compress', function() {
    return gulp.src('app/libs/**/*.js')
    .pipe(gzip())
    .pipe(gulp.dest('./build/libs'));
});

// Compile html
gulp.task('fileinclude', function(done) {
	gulp.src('app/__*.html')
		.pipe(fileinclude({
			prefix: '@@'
		// ,basepath: '@file'
	}))
	// .pipe(rename({ prefix: '11' }))
	.pipe(rename(function(opt) {
      opt.basename = opt.basename.replace(/^__+/, '');
      return opt;
    }))
	.pipe(gulp.dest('app'));
	done();
});

// HTML Live Reload
gulp.task('code', function() {
	return gulp.src('app/*.html')
	.pipe(browserSync.reload({ stream: true }));
});

// Gulp run
gulp.task('watch', function() {
	gulp.watch('app/scss/**/*.scss', gulp.parallel('styles'));
	gulp.watch('app/_*.html', gulp.parallel('fileinclude'));
	gulp.watch('app/*.html', gulp.parallel('code'));
});
gulp.task('default', gulp.parallel('styles', 'browser-sync', 'watch'));



