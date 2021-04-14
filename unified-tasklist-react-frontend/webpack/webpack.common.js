const webpack = require("webpack");
const { BaseHrefWebpackPlugin } = require("base-href-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const PolyfillInjectorPlugin = require("webpack-polyfill-injector");
const IgnoreNotFoundExportPlugin = require("ignore-not-found-export-plugin");
const path = require("path");

const utils = require("./utils.js");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const getTsLoaderRule = env => {
  const rules = [
    {
      loader: "cache-loader",
      options: {
        cacheDirectory: path.resolve("target/cache-loader")
      }
    },
    {
      loader: "thread-loader",
      options: {
        // There should be 1 cpu for the fork-ts-checker-webpack-plugin.
        // The value may need to be adjusted (e.g. to 1) in some CI environments,
        // as cpus() may report more cores than what are available to the build.
        workers: require("os").cpus().length - 1
      }
    },
    {
      loader: "ts-loader",
      options: {
        transpileOnly: true,
        happyPackMode: true
      }
    }
  ];
  if (env === "development") {
    rules.unshift({
      loader: "react-hot-loader/webpack"
    });
  }
  return rules;
};

const tsAliases = utils.resolveTsconfigPathsToAlias({
  tsconfigPath: "../tsconfig.json",
  webpackConfigBasePath: "./"
});

module.exports = options => ({
  entry: {
    default: `webpack-polyfill-injector?${JSON.stringify({
      modules: ["./src/main/webapp/app/index.tsx"]
    })}!`
  },
  cache: options.env !== "production",
  resolve: {
    alias: {
      ...tsAliases,
      react: utils.root("node_modules", "react"),
      "react-dom": utils.root("node_modules", "react-dom")
    },
    extensions: [".js", ".jsx", ".ts", ".tsx", ".json"],
    modules: ["node_modules"]
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: options.env == "development"
            }
          },
          "css-loader"
        ]
      },
      {
        test: /\.tsx?$/,
        use: getTsLoaderRule(options.env),
        include: Object.values(tsAliases),
        exclude: [utils.root("node_modules")]
      },
      {
        test: /\.(jpe?g|png|gif|svg|woff2?|ttf|eot)$/i,
        loader: "file-loader",
        options: {
          digest: "hex",
          hash: "sha512",
          name: "content/[hash].[ext]"
        }
      },
      {
        enforce: "pre",
        test: /\.jsx?$/,
        loader: "source-map-loader"
      },
      // Transpile react-hook-form package which is not ES5
      {
        test: /\.jsx?$/,
        exclude: /node_modules\/(?!react-hook-form)/,
        loader: "babel-loader",
        query: {
          presets: ["@babel/preset-env"]
        }
      }
    ]
  },
  stats: {
    children: false
  },
  performance: { hints: false },
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          test(module, chunks) {
            var isCustomPolyfills =
              /node_modules[\\/]text-encoding/.test(module.resource);
            var isNodeModules = /node_modules[\\/]/.test(module.resource);
            return !isCustomPolyfills && isNodeModules;
          },
          name: "vendors",
          chunks: "all"
        },
        customPolyfills: {
          test(module, chunks) {
            var isCustomPolyfills =
              /node_modules[\\/]text-encoding/.test(module.resource);
            var isCustomPolyfillsLoader = /polyfills/.test(
              module.resource
            );
            return isCustomPolyfills || isCustomPolyfillsLoader;
          },
          name: "customPolyfills",
          chunks: "all",
          enforce: true
        }
      }
    }
  },
  plugins: [
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      filename: options.env == "development" ? 'content/[name].css' : 'content/[name].[hash].css',
      chunkFilename: options.env == "development" ? 'content/[id].css' : 'content/[id].[hash].css',
    }),
    new IgnoreNotFoundExportPlugin(["Types"]), // https://github.com/TypeStrong/ts-loader/issues/653
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: `'${options.env}'`,
        BUILD_TIMESTAMP: `'${new Date().getTime()}'`,
        VERSION: `'${utils.parseVersion()}'`,
        DEBUG_INFO_ENABLED: options.env === "development",
        // The root URL for API calls, ending with a '/' - for example: `"https://www.test.com:8081/myservice/"`.
        // If this URL is left empty (""), then it will be relative to the current context.
        // If you use an API server, in `prod` mode, you will need to enable CORS
        SERVER_API_URL: `''`
      }
    }),
    new ForkTsCheckerWebpackPlugin({ tslint: false }),
    new CopyWebpackPlugin([
      { from: "./src/main/webapp/content/", to: "content" },
    ]),
    new HtmlWebpackPlugin({
      template: "./src/main/webapp/index.html",
      chunksSortMode: "dependency",
      inject: "body",
    }),
    new HtmlWebpackPlugin({
      template: "./src/main/webapp/error-unauthorized.html",
      filename: "error-unauthorized.html",
      inject: false,
    }),
    new HtmlWebpackPlugin({
      template: "./src/main/webapp/error-forbidden.html",
      filename: "error-forbidden.html",
      inject: false,
    }),
    new BaseHrefWebpackPlugin({ baseHref: "/" }),
    new PolyfillInjectorPlugin({
      singleFile: true, // `false` will reduce used up bandwidth, but `true` would create thousands of files for all polyfill combinations
      polyfills: [
        "Promise",
        "fetch",
        "Array.prototype.find",
        "Array.prototype.findIndex",
        "Array.prototype.includes",
        "Array.prototype.fill",
        "Array.from",
        "String.prototype.includes",
        "String.prototype.startsWith",
        "String.prototype.endsWith",
        "String.prototype.padStart",
        "Element.prototype.classList",
        "Object.assign",
        "Object.keys",
        "Object.values",
        "Object.entries",
        "Number.parseInt",
        "Number.parseFloat",
        "Number.isInteger",
        "Symbol",
        "IntersectionObserver",
        "URL"
      ]
    })
  ]
});
