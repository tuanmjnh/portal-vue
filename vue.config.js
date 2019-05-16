var webpack = require("webpack");
var path = require("path");
var _package = require('./package.json');
// import env from 'src/environment/index.js'
// console.log(env)
const env = { //environment
  dev: { // development
    publicPath: '/',
    outputDir: '/dist',
  },
  prod: { // production
    publicPath: '/portal/',
    outputDir: '/Application/portal-vue',
  }
}

process.env.VUE_APP_VERSION = _package.version
process.env.VUE_APP_TITLE = _package.name
module.exports = {
  configureWebpack: {
    devtool: 'source-map',
    // filename: 'dist/js/[name].[hash:8].js',
    // chunkFilename: 'dist/js/[name].[hash:8].js',
  },
  // publicPath: '/portal/',
  // outputDir: 'dist',
  publicPath: process.env.NODE_ENV === 'production' ? env.prod.publicPath : env.dev.publicPath,
  outputDir: process.env.NODE_ENV === 'production' ? env.prod.outputDir : env.dev.outputDir,
}
