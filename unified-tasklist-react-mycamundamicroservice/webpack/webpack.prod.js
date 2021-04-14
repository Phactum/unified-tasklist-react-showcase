const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const utils = require('./utils.js');
const common = require('./webpack.common');
const packageJson = require("../package.json");
const optionalDependencies = Object.keys(packageJson.optionalDependencies);

const config = Object.keys(common).filter(c => c !== 'tenant').reduce((r, c) => ({ ...r, [c]: common[c] }), {});

module.exports = webpackMerge(config, {
//  devtool: 'source-map',
  cache: false,
  mode: 'production',
  output: {
      libraryTarget: 'commonjs',
      library: 'components'
  },
  stats: {
      children: false
  },
  externals: [
    function(context, request, callback) {
      var isUnifiedTasklistCommon = /\/unified-tasklist\//.test(context)
          || /\/commons-react\//.test(context);
      // optionalDependencies are provided by tasklist
      var isOptionalDependency = optionalDependencies.reduce((acc, dep) => acc
              || ((dep === request) // is exactly the same
              || request.startsWith(dep + '/')) // is a reference into the dependency
              , false);
      var isLocalImport = /^\./.test(request);
      if ((isUnifiedTasklistCommon && !isLocalImport)
          || isOptionalDependency) {
        return callback(null, 'commonjs ' + request);
      }
      callback();
    },
  ],
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
        new webpack.DefinePlugin({
          'process.env': {
            NODE_ENV: 'production',
            BUILD_TIMESTAMP: `'${new Date().getTime()}'`,
            VERSION: `'${utils.parseVersion()}'`,
            DEBUG_INFO_ENABLED: 'production',
            SERVER_API_URL: `''`
          },
    		}),
        new CompressionPlugin({
          test: /\.js$|\.css$|\.html$|\.eot?.+$|\.ttf?.+$|\.woff?.+$|\.svg?.+$/,
        }),
        new webpack.SourceMapDevToolPlugin({
           filename: '[file].map[query]',
           columns: true,
           module: true,
           publicPath: `/frontend/${common.tenant}/`,
        }),
    ]
});
