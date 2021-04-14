const utils = require('./utils.js');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const StatsWriterPlugin = require('webpack-stats-plugin').StatsWriterPlugin;
const statsToJava = require('./stats-to-java.js');
const { TsConfigPathsPlugin } = require('awesome-typescript-loader');

const tenant = 'mycamundamicroservice';

module.exports = {
  tenant,
  target: 'web',
  entry: {
    myformkey: './src/main/mycamundamicroservice/app/MyForm',
    myformkey_list: './src/main/mycamundamicroservice/app/MyForm_list',
  },
  output: {
    path: utils.root(`target/classes/static/frontend/${tenant}`),
    filename: '[name].[hash].bundle.js',
    chunkFilename: '[name].[hash].chunk.js',
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"]
      },
      {
        test: /\.tsx?$/,
        loader: 'awesome-typescript-loader',
        options: {
          transpileOnly: true,
        },
      },
      {
        enforce: 'pre',
        test: /\.js$/,
        loader: 'source-map-loader',
      },
      { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "url-loader?limit=10000&mimetype=application/font-woff" },
      { test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "file-loader" }
    ],
  },
  resolve: {
    modules: ['node_modules', 'src'],
    extensions: ['*', '.ts', '.tsx', '.js', '.json'],
    plugins: [new TsConfigPathsPlugin()],
    alias: {
      react: utils.root('node_modules', 'react'),
      'react-dom': utils.root('node_modules', 'react-dom'),
    },
  },
  performance: { hints: false },
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
        },
      },
    },
  },
  plugins: [
    new StatsWriterPlugin({
      filename: `webpack.json`,
      fields: null,
      transform(stats, opts) {
        return statsToJava.transform(stats, tenant, opts);
      },
    }),
  ],
};
