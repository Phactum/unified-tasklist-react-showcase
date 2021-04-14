const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const MomentLocalesPlugin = require('moment-locales-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const path = require('path');

const utils = require('./utils.js');
const commonConfig = require('./webpack.common.js');

const ENV = 'production';

module.exports = webpackMerge(commonConfig({ env: ENV }), {
  devtool: 'source-map',
  mode: ENV,
  output: {
    path: utils.root('target/classes/static/frontend/'),
    publicPath: '/frontend',
    filename: 'app/[name].[hash].bundle.js',
    chunkFilename: 'app/[name].[hash].chunk.js',
  },
  performance: { hints: 'warning' },
  optimization: {
    runtimeChunk: false,
    minimize: true,
    minimizer: [
      new TerserPlugin({
        cache: true,
        parallel: true,
        sourceMap: true, // Enable source maps. Please note that this will slow down the build
        terserOptions: {
          ecma: 6,
          toplevel: true,
          module: true,
          beautify: false,
          comments: false,
          compress: {
            warnings: false,
            ecma: 6,
            module: true,
            toplevel: true,
          },
          output: {
              comments: false,
              beautify: false,
              indent_level: 2,
              ecma: 5,
              semicolons: false,
          },
          mangle: {
            keep_fnames: true,
            module: true,
            toplevel: true,
          },
        },
      }),
      new OptimizeCSSAssetsPlugin({}),
    ],
  },
  plugins: [
    new MomentLocalesPlugin({
      localesToKeep: [
        'en',
      ],
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false,
    }),
    new CompressionPlugin({
      test: /\.js$|\.css$|\.html$|\.eot?.+$|\.ttf?.+$|\.woff?.+$|\.svg?.+$/,
    }),
  ],
});
