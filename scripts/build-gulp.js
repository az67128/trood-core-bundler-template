'use strict'
const path = require('path')
const paths = require('../config/paths');
var fs = require('fs')
const webpack = require('webpack')
const EmptyModulePlugin = require('empty-module-webpack-plugin')


const nodeModules = {}
fs.readdirSync('node_modules')
  .filter(function(x) {
    return ['.bin'].indexOf(x) === -1
  })
  .forEach(function(mod) {
    nodeModules[mod] = 'commonjs ' + mod
  })

webpack({
  externals: nodeModules,
  entry: './gulpfileTemplate.js',
  target: 'node',
  output: {
    path: path.join(__dirname, '../'),
    filename: 'gulpfile.js',
  },
  resolve: {
    modules: ['./node_modules'],
    alias: {
      '$trood/componentLibraries/manifest': paths.appSrc + '/config.js',
      '$trood/businessObjects/manifest': paths.appSrc + '/config.js',
      $trood: paths.appSrc,
    },
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules|manifest\.js/,
        loader: require.resolve('babel-loader'),
        options: {
          // This is a feature of `babel-loader` for webpack (not Babel itself).
          // It enables caching results in ./node_modules/.cache/babel-loader/
          // directory for faster rebuilds.
          cacheDirectory: true,
        },
      },
    ],
  },
  plugins: [
    // We will try to load a lot of npm modules, when parsin project structure,
    // but we don't really need them , we need only local requires
    // new EmptyModulePlugin(/^[^.](?!.*(ulp-|abel-polyfill|trood))|\.css$/),
    new EmptyModulePlugin(/\.css$/),
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 1,
    }),
  ],
}, (err, stats) => {
  if (err || stats.hasErrors()) {
    // Handle errors here
    console.log(err, stats)
  }
  // Done processing
})
