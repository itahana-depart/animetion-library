const webpack = require('webpack');
const path = require('path');

const config = {
	mode: 'development',
	// mode: "development", // gulpの方で切り替え
	entry: {
		top: './src/js/app.js',
		scroll: './src/js/scroll.app.js',
		svg: './src/js/svg.app.js',
		parallax: './src/js/parallax.app.js',
	},
	output: {
		filename: '[name].js',
	},
	// jQueryをプラグイン読み込みする場合
	// plugins: [
	// 	new webpack.ProvidePlugin({
	// 		$: 'jquery',
	// 		jQuery: 'jquery',
	// 	}),
	// ],
	// vendorファイルを分けたい場合
	// optimization: {
	// 	splitChunks: {
	// 		name: 'vendor',
	// 		chunks: 'initial',
	// 	}
	// },
	// vendorファイルをCDNなど外部読み込みにかえたい場合
	// externals: {
	// 	jquery: 'jQuery'
	// },
	cache: true,
	module: {
		rules: [
			{
				test: /\.js$/,
				use: 'babel-loader',
				exclude: /node_modules/,
			},
			{
				test: /\.scss$/,
				use: ['style-loader', 'css-loader', 'sass-loader'],
			},
		],
	},
};

module.exports = config;
