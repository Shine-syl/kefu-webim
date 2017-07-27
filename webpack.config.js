/*
	以下文件老版本会引用到，不能在服务器上彻底删除

	/static/js/em-open.js
	/static/js/em-transfer.js
*/

const path = require("path");
const webpack = require("webpack");
const i18next = require("i18next");
const languageMap = require("./src/i18n/zh-CN");
const VERSION = "pre_47.15.0";

var conmmonConfig;
var transfer;
var easemob;
var app;
var taskList;

i18next.init({
	lng: "zh-CN",
	fallbackLng: false,
	keySeparator: ".",
	nsSeparator: false,
	saveMissing: true,
	resources: {
		"zh-CN": {
			translation: languageMap
		},
	},
});

conmmonConfig = {
	plugins: [
		new webpack.optimize.UglifyJsPlugin({
			compress: {
				warnings: false,
			},
			test: /\.js$/i,
			sourceMap: true,
			comments: false,
			mangle: {
				screw_ie8: false,
			},
		}),
	],
	devtool: "source-map",
	module: {
		loaders: [
			{
				test: /easemob\.scss$/,
				loaders: [
					"ie8-style-loader?sourceMap=true",
					"postcss-loader?sourceMap=true",
					"sass-loader?sourceMap=true",
				],
			},
			{
				test: /im\.html$/,
				loaders: [
					"file-loader?name=../../[name].[ext]",
					"extract-loader",
					"html-loader",
				],
			},
			{
				test: /transfer\.html$/,
				loaders: [
					"file-loader?name=../../[name].[ext]",
					"extract-loader",
					"html-loader",
				],
			},
			{
				test: /im\.scss$/,
				loaders: [
					"file-loader?name=../css/[name].css",
					"string-replace-loader"
						+ "?search=__WEBIM_PLUGIN_VERSION__"
						+ "&replace=" + VERSION
						+ "&flags=g",
					"postcss-loader?sourceMap=true",
					"sass-loader?sourceMap=true&importLoader=true"
				],
			},
			{
				test: require.resolve("./src/js/app/sdk/webim.config.js"),
				loader: "expose-loader?WebIM"
			},
			{
				test: require.resolve("underscore"),
				loader: "expose-loader?_"
			},
			{
				test: require.resolve("./src/js/app/lib/modernizr.js"),
				loader: "expose-loader?Modernizr"
			},
			{
				test: [
					/init\.js$/,
					/userAPI\.js$/,
					/im\.html/,
					/icon\.scss/,
					/iframe\.js/,
				],
				loader: "string-replace-loader",
				query: {
					search: "__WEBIM_PLUGIN_VERSION__",
					replace: VERSION,
					flags: "g",
				},
			},
			{
				test: /\.js$/,
				loader: "i18next-loader",
				query: {
					quotes: "\"",
				},
			},
		],
	},
};

transfer = Object.assign({}, conmmonConfig, {
	name: "transfer",
	entry: [
		"./src/js/transfer/api.js",
		"./src/html/transfer.html",
	],
	output: {
		filename: "em-transfer.js",
		path: path.resolve(__dirname, "static/js"),
	},
});

easemob = Object.assign({}, conmmonConfig, {
	name: "easemob",
	entry: [
		"./src/js/common/polyfill",
		"./src/js/plugin/userAPI.js",
	],
	output: {
		filename: "easemob.js",
		path: path.resolve(__dirname, "."),
		// todo: test ie 7 prompt
		// library: 'easemob-kefu-webim-plugin',
		// libraryTarget: 'umd',
		// umdNamedDefine: true,
	},
});

app = Object.assign({}, conmmonConfig, {
	name: "app",
	entry: [
		"./src/js/app/modules/init.js",
		"./src/scss/im.scss",
		"./src/html/im.html",
	],
	output: {
		filename: "main.js",
		path: path.resolve(__dirname, "static/js"),
	},
});

taskList = [
	transfer,
	easemob,
	app,
];

module.exports = /development/.test(process.env.npm_lifecycle_script)
	? taskList
	// todo: modify this configuration
	: taskList
;
