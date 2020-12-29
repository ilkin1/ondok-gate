const path = require('path');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

const webpack = require('webpack')
const nodeExternals = require('webpack-node-externals')

// https://medium.com/the-andela-way/how-to-set-up-an-express-api-using-webpack-and-typescript-69d18c8c4f52
// const WebpackShellPlugin = require('webpack-shell-plugin');

const mode = process.env.NODE_ENV;
const isDev = mode === 'development';

const plugins = {
  development: [
    new ForkTsCheckerWebpackPlugin(),
    // new WebpackShellPlugin({
    //   onBuildEnd: ['yarn run:dev']
    // }),
  ]
}[mode] || [];

module.exports = {
  target: 'node',
  mode: process.env.NODE_ENV,
  // node: {
  //   __dirname: false,
  //   __filename: false,
  // },
  externals: [nodeExternals()],

  watch: isDev,
  watchOptions: {
    ignored: /node_modules/
  },
  devtool: 'cheap-source-map',
  // devtool: 'inline-source-map',
  entry: {
    gate: path.resolve(__dirname, 'src'),
    // seed: path.resolve(__dirname, 'src/domain/seed.ts'),
    sock: path.resolve(__dirname, 'src/sock'),
    // media: path.resolve(__dirname, 'src/media'),
  },

  node: {
    __dirname: true,
  },

  output: {
    // filename: 'bundle.js',
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
    devtoolModuleFilenameTemplate: "[absolute-resource-path]",
    libraryTarget: 'commonjs'
    // sourceMapFilename: '[file].map',
    // devtoolModuleFilenameTemplate: "..//[absolute-resource-path]",
    // devtoolFallbackModuleFilenameTemplate: "..//[absolute-resource-path]?[hash]"
  },

  externals: [
    // (context, request, callback) => {
    //   // console.log([context, request]);
    //   if (/node_modules/.test(context)) {
    //     callback(null, 'commonjs ' + request)
    //   } else {
    //     callback();
    //   }
    // }
    {
      sharp: 'sharp',
      pg: {commonjs: 'pg'},
      argon2: 'argon2',
      knex: 'commonjs knex'
    },
  ],

  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json']
  },

  module: {
    rules: [
      {test: /\.(ts|js)x?$/, loader: 'babel-loader', exclude: /node_modules/},
      // {
      //   // For node binary relocations, include ".node" files as well here
      //   test: /\.(m?js|node)$/,
      //   // it is recommended for Node builds to turn off AMD support
      //   parser: { amd: false },
      //   use: {
      //     loader: '@zeit/webpack-asset-relocator-loader',
      //     options: {
      //       // optional, base folder for asset emission (eg assets/name.ext)
      //       outputAssetBase: 'assets',
      //       // optional, restrict asset emissions to only the given folder.
      //       filterAssetBase: process.cwd(),
      //       // optional, permit entire __dirname emission
      //       // eg `const nonAnalyzable = __dirname` can emit everything in the folder
      //       emitDirnameAll: false,
      //       // optional, permit entire filterAssetBase emission
      //       // eg `const nonAnalyzable = process.cwd()` can emit everything in the cwd()
      //       emitFilterAssetBaseAll: false,
      //       // optional, a list of asset names already emitted or
      //       // defined that should not be emitted
      //       existingAssetNames: [],
      //       wrapperCompatibility: false, // optional, default
      //       // build for process.env.NODE_ENV = 'production'
      //       production: true, // optional, default is undefined
      //       cwd: process.cwd(), // optional, default
      //       debugLog: false, // optional, default
      //     }
      //   }
      // }
      // {
      //   test: /node_modules[\\/]@grpc[\\/]grpc-js/,
      //   use: 'null-loader',
      // },
      // {
      //   test: /node_modules[\\/]grpc/,
      //   use: 'null-loader',
      // },
      // {
      //   test: /node_modules[\\/]retry-request/,
      //   use: 'null-loader',
      // },
      // {
      //   test: /node_modules[\\/]https?-proxy-agent/,
      //   use: 'null-loader',
      // },
      // {
      //   test: /node_modules[\\/]gtoken/,
      //   use: 'null-loader',
      // },
    ],
  }
  ,

  plugins: [
    ...plugins,
    new webpack.IgnorePlugin(/^(hiredis)$/),
    // new webpack.EnvironmentPlugin({
    // GATE_PROJECT_DIR: __dirname
    // }),
    // new webpack.IgnorePlugin(/^pg$/),
  ]
};
