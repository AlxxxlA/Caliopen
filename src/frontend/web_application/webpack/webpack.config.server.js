const path = require('path');
const webpackMerge = require('webpack-merge');
const configs = require('./config.js');
const common = require('./webpack.common.js');
const { WatchIgnorePlugin } = require('webpack');

const base = {
  target: 'node',
  node: {
    __dirname: true,
    __filename: true,
  },
  entry: ['babel-polyfill', path.join(__dirname, '../server/index.js')],
  output: {
    path: path.join(__dirname, '../dist/server/'),
    filename: 'index.js',
    chunkFilename: '[name].[chunkhash].js',
    publicPath: '/',
  },
  externals: [
    (context, request, callback) => {
      if ([
        'body-parser', 'cookie-parser', 'debug', 'express', 'express-http-proxy', 'iron', 'locale',
        'serve-favicon', 'config/server.defaults.js', 'argv',
      ].some(module => module === request)) {
        return callback(null, `commonjs ${request}`);
      }

      return callback();
    },
  ],
  module: {
    rules: [
      {
        test: /\.(s?css|jpe?g|png|gif)$/,
        loader: 'null-loader',
      },
      {
        test: /\.jsx?$/,
        include: path.join(__dirname, '../server/'),
        loader: 'babel-loader',
      },
      { test: /\.html$/, loader: 'raw-loader' },
    ],
  },
  optimization: {
    minimize: false,
  },
  plugins: [
    new WatchIgnorePlugin([
      path.join(__dirname, '../src/'),
      path.join(__dirname, '../locale/'),
    ]),
  ],
};

const config = webpackMerge(
  common,
  configs.configureEnv('server'),
  base
);

module.exports = config;
