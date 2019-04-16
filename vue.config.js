var webpack = require("webpack");
var path = require("path");
module.exports = {
  configureWebpack: {
    //devtool: 'source-map',
    // plugins: [
    //   new webpack.ProvidePlugin({
    //     $: "jquery",
    //     jQuery: "jquery",
    //     jquery: "jquery"
    //   })
    // ],
    // resolve: {
    //   extensions: [".js", ".vue", ".json"],
    //   alias: {
    //     jquery: "jquery/src/jquery.js",
    //     "jquery-ui": "jquery-ui",
    //     d3: "d3",
    //     modules: path.join(__dirname, "node_modules")
    //   }
    // }
  },
  outputDir: 'D:/Application/portal-vue',
  // publicPath: 'portal',
  publicPath: process.env.NODE_ENV === 'production' ? '/portal/' : '/'
}
