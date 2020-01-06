// gulpfile.js
const gulp = require('gulp'),
	bs = require('browser-sync'),
	plumber = require('gulp-plumber'),
	changed = require('gulp-changed'),
	del = require('del'),
	sass = require('gulp-sass'),
	sourcemaps = require('gulp-sourcemaps'),
	postcss = require('gulp-postcss'),
	cssnext = require('postcss-cssnext'),
	gulpStylelint = require('gulp-stylelint'),
	cleanCSS = require('gulp-clean-css'),
	ejs = require('gulp-ejs'),
	fs = require('fs'),
	rename = require('gulp-rename'),
	imagemin = require('gulp-imagemin'),
	pngquant = require('imagemin-pngquant'),
	mozjpeg = require('imagemin-mozjpeg');

// webpack
const webpackStream = require('webpack-stream'),
	webpack = require('webpack'),
	webpackConfig = require('./webpack.config'),
	eslint = require('gulp-eslint');

//config読み込み
const config = require('./gulpconfig.json');

// 各種設定
let setting = {
	mode: 'development', // 'production'
	prefixer: config.prefixer,
	dir: config.dir,
	serverSet: config.serverSet,
};

// dev sass task
gulp.task('sass', function(callback) {
	if (setting.mode == 'development') {
		return gulp
			.src(setting.dir.scssDir + '*.scss')
			.pipe(plumber())
			.pipe(sourcemaps.init())
			.pipe(
				sass({
					outputStyle: 'expanded',
				})
			)
			.pipe(postcss([cssnext(setting.prefixer.browsers)]))
			.pipe(
				gulpStylelint({
					reporters: [{formatter: 'string', console: true}],
					syntax: 'scss',
					fix: true,
					debug: true,
				})
			)
			.pipe(sourcemaps.write('./maps'))
			.pipe(gulp.dest(setting.dir.devDir + 'assets/css'));
	} else if (setting.mode == 'production') {
		return gulp
			.src(setting.dir.scssDir + '*.scss')
			.pipe(plumber())
			.pipe(
				sass({
					outputStyle: 'expanded',
				})
			)
			.pipe(postcss([cssnext(setting.prefixer.browsers)]))
			.pipe(
				gulpStylelint({
					reporters: [{formatter: 'string', console: true}],
					syntax: 'scss',
					fix: true,
					debug: true,
				})
			)
			.pipe(gulp.dest(setting.dir.destDir + 'assets/css'));
	}
});

// sass minify
gulp.task('sass-min', function() {
	if (setting.mode == 'development') {
		// minify
		return gulp
			.src(setting.dir.scssDir + '*.scss')
			.pipe(plumber())
			.pipe(sourcemaps.init())
			.pipe(
				sass({
					outputStyle: 'expanded',
				})
			)
			.pipe(postcss([cssnext(setting.prefixer.browsers)]))
			.pipe(
				gulpStylelint({
					reporters: [{formatter: 'string', console: true}],
					syntax: 'scss',
					fix: true,
					debug: true,
				})
			)
			.pipe(cleanCSS())
			.pipe(rename({extname: '.min.css'}))
			.pipe(sourcemaps.write('./maps'))
			.pipe(gulp.dest(setting.dir.devDir + 'assets/css'));
	} else if (setting.mode == 'production') {
		// minify
		return gulp
			.src(setting.dir.scssDir + '*.scss')
			.pipe(plumber())
			.pipe(
				sass({
					outputStyle: 'expanded',
				})
			)
			.pipe(postcss([cssnext(setting.prefixer.browsers)]))
			.pipe(
				gulpStylelint({
					reporters: [{formatter: 'string', console: true}],
					syntax: 'scss',
					fix: true,
				})
			)
			.pipe(cleanCSS())
			.pipe(rename({extname: '.min.css'}))
			.pipe(gulp.dest(setting.dir.destDir + 'assets/css'));
	}
});

gulp.task('css', function() {
	if (setting.mode == 'development') {
		const css_src = [setting.dir.devDir + '**/css/*.scss', '!' + setting.dir.scssDir + '*.scss'];

		return gulp
			.src(css_src)
			.pipe(plumber())
			.pipe(
				sass({
					outputStyle: 'expanded',
				})
			)
			.pipe(postcss([cssnext(setting.prefixer.browsers)]))
			.pipe(
				gulpStylelint({
					reporters: [{formatter: 'string', console: true}],
					syntax: 'scss',
					fix: true,
					debug: true,
				})
			)
			.pipe(gulp.dest(setting.dir.devDir))
			.pipe(cleanCSS())
			.pipe(rename({extname: '.min.css'}))
			.pipe(gulp.dest(setting.dir.devDir));
	} else if (setting.mode == 'production') {
		const css_src = [setting.dir.destDir + '**/css/*.scss', '!' + setting.dir.scssDir + '*.scss'];

		return gulp
			.src(css_src)
			.pipe(plumber())
			.pipe(
				sass({
					outputStyle: 'expanded',
				})
			)
			.pipe(postcss([cssnext(setting.prefixer.browsers)]))
			.pipe(
				gulpStylelint({
					reporters: [{formatter: 'string', console: true}],
					syntax: 'scss',
					fix: true,
				})
			)
			.pipe(cleanCSS())
			.pipe(rename({extname: '.min.css'}))
			.pipe(gulp.dest(setting.dir.destDir));
	}
});

// ejs task
gulp.task('ejs', function(callback) {
	if (setting.mode == 'development') {
		const ejs_src = function(_data) {
			// テンプレートファイル
			return setting.dir.tmplDir + _data.ejs_layout;
		};
		const json = JSON.parse(fs.readFileSync(setting.dir.jsonDir + 'pages.json'));
		const siteData = JSON.parse(fs.readFileSync(setting.dir.jsonDir + 'site.json'));
		json.pages.forEach(function(data, index) {
			// console.log(data);
			// console.log(index, data.id);
			gulp
				.src(ejs_src(data))
				.pipe(plumber())
				.pipe(
					ejs({page: data, all: json, site: siteData, mode: setting.mode}, '', {
						ext: '.html',
					})
				)
				.pipe(
					rename(function(path) {
						path.dirname = '.' + data.dist_dir;
						path.basename = data.dist_file;
						// console.log(path);
					})
				)
				.pipe(gulp.dest(setting.dir.devDir));
		});
		callback();
	} else if (setting.mode == 'production') {
		const ejs_src = function(_data) {
			// テンプレートファイル
			return setting.dir.tmplDir + _data.ejs_layout;
		};
		const json = JSON.parse(fs.readFileSync(setting.dir.jsonDir + 'pages.json'));
		const siteData = JSON.parse(fs.readFileSync(setting.dir.jsonDir + 'site.json'));
		json.pages.forEach(function(data, index) {
			gulp
				.src(ejs_src(data))
				.pipe(plumber())
				.pipe(
					ejs({page: data, all: json, site: siteData, mode: setting.mode}, '', {
						ext: '.html',
					})
				)
				.pipe(
					rename(function(path) {
						path.dirname = '.' + data.dist_dir;
						path.basename = data.dist_file;
					})
				)
				.pipe(gulp.dest(setting.dir.destDir));
		});
		callback();
	}
});

// 画像圧縮
gulp.task('imagemin', function() {
	if (setting.mode == 'development') {
		return gulp
			.src(setting.dir.imgDir + '**/*.+(jpg|jpeg|png|gif|svg)')
			.pipe(changed(setting.dir.devDir + 'assets/img'))
			.pipe(
				imagemin([
					pngquant({quality: [0.6, 0.8]}),
					mozjpeg({quality: [80]}),
					imagemin.svgo({
						plugins: [{removeViewBox: true}, {cleanupIDs: false}],
					}),
					imagemin.gifsicle({interlaced: true}),
				])
			)
			.pipe(gulp.dest(setting.dir.devDir + 'assets/img'));
	} else if (setting.mode == 'production') {
		return gulp
			.src(setting.dir.imgDir + '**/*.+(jpg|jpeg|png|gif|svg)')
			.pipe(changed(setting.dir.destDir + 'assets/img'))
			.pipe(
				imagemin([
					pngquant({quality: [0.6, 0.8]}),
					mozjpeg({quality: [80]}),
					imagemin.svgo({
						plugins: [{removeViewBox: true}, {cleanupIDs: false}],
					}),
					imagemin.gifsicle({interlaced: true}),
				])
			)
			.pipe(gulp.dest(setting.dir.destDir + 'assets/img'));
	}
});

// webpack bundle
gulp.task('webpack', function() {
	if (setting.mode == 'development') {
		// developmentで出力
		webpackConfig.mode = setting.mode;
		return gulp
			.src([setting.dir.jsDir + '**/*.js'])
			.pipe(plumber())
			.pipe(eslint({useEslintrc: true}))
			.pipe(eslint({fix: true}))
			.pipe(eslint.format())
			.pipe(webpackStream(webpackConfig, webpack))
			.pipe(gulp.dest(setting.dir.devDir + 'assets/js/'));
	} else if (setting.mode == 'production') {
		webpackConfig.mode = setting.mode;
		return gulp
			.src([setting.dir.jsDir + '**/*.js'])
			.pipe(plumber())
			.pipe(eslint({useEslintrc: true}))
			.pipe(eslint({fix: true}))
			.pipe(eslint.format())
			.pipe(webpackStream(webpackConfig, webpack))
			.pipe(gulp.dest(setting.dir.destDir + 'assets/js/'));
	}
});

// static item
gulp.task('static', function() {
	if (setting.mode == 'development') {
		return gulp.src([setting.dir.staticDir + '**/*.*']).pipe(gulp.dest(setting.dir.devDir));
	} else if (setting.mode == 'production') {
		return gulp.src([setting.dir.staticDir + '**/*.*']).pipe(gulp.dest(setting.dir.destDir));
	}
});

// distを削除
gulp.task('clean', function(cb) {
	let destDirFound;
	try {
		destDirFound = fs.statSync(setting.dir.destDir).isDirectory();
		if (destDirFound) {
			del([setting.dir.destDir + '**'], cb);
		}
		cb();
	} catch (err) {
		cb();
	}
});

// serve task
gulp.task('serve', function() {
	const initObj = setting.serverSet;
	// console.log(initObj);

	bs.init(initObj);

	gulp.watch(setting.dir.scssDir + '**/*.scss', gulp.task('sass'));
	gulp.watch(setting.dir.scssDir + '**/*.scss', gulp.task('sass-min'));
	gulp.watch(setting.dir.srcDir + '**/*.scss', gulp.task('css'));
	gulp.watch(setting.dir.tmplDir + '**/*.ejs', gulp.task('ejs'));
	gulp.watch(setting.dir.tmplDir + '**/_*.ejs', gulp.task('ejs'));
	gulp.watch(setting.dir.imgDir + '**/*.+(jpg|jpeg|png|gif|svg)', gulp.task('imagemin'));
	gulp.watch(setting.dir.jsDir + '**/*.js', gulp.task('webpack'));

	// dev環境監視
	gulp.watch(setting.dir.devDir + '**/*.html').on('change', bs.reload);
	gulp.watch(setting.dir.devDir + '**/*.css').on('change', bs.reload);
	gulp.watch(setting.dir.devDir + '**/*.min.css').on('change', bs.reload);

	// envで出し分けなどもできなくはない。
	// 	if (setting.mode == 'production') {
	// 		const initObj = {
	// 			server: setting.destDir
	// 		}
	// 		bs.init(initObj);
	// 	// prod環境監視
	// 	gulp.watch(setting.destDir + '**/*.html').on('change', bs.reload);
	// 	gulp.watch(setting.destDir + '**/*.css').on('change', bs.reload);
	// 	gulp.watch(setting.destDir + '**/*.min.css').on('change', bs.reload);
	// }
});

// build完了メッセージ・・・
gulp.task('message', function(callback) {
	setTimeout(function() {
		console.log('/*************************************/');
		console.log('🤮 build complete!! check dist dir.');
		console.log('/*************************************/');
	}, 500);
	callback();
});

// build時のproduction変更
gulp.task('changeProd', function(callback) {
	setting.mode = 'production';
	callback();
});

// dev環境build
gulp.task('dev', gulp.series('sass', 'sass-min', 'css', 'ejs', 'imagemin', 'webpack', 'static'));

// リリース用ファイルbuild
gulp.task('build', gulp.series('changeProd', 'clean', 'sass', 'sass-min', 'css', 'ejs', 'imagemin', 'webpack', 'static', 'message'));

// default 各タスク並列実行、serveでwatch
gulp.task('default', gulp.series('sass', 'sass-min', 'css', 'ejs', 'imagemin', 'webpack', 'static', 'serve'));

// コマンド概要
/*
gulp -> gulp serve ローカルでサーバ立ち上げ
gulp dev dev環境ファイルビルド
gulp build リリース用ファイルビルド
*/
