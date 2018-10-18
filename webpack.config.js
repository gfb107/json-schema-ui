const path = require( 'path' )
const webpack = require( 'webpack' )
const HTMLWebpackPlugin = require( 'html-webpack-plugin' )
const uglifyJsPlugin = require( 'uglifyjs-webpack-plugin' )
const config = require( 'config' )

/*-------------------------------------------------*/

let plugins = [
  new HTMLWebpackPlugin({
    template: path.resolve( __dirname, 'index.html' )
  }),
  new HTMLWebpackPlugin({
    filename: 'bootstrap3.html',
    template: path.resolve( __dirname, 'bootstrap3.html' )
  }),
  new HTMLWebpackPlugin({
    filename: 'manual.html',
    template: path.resolve( __dirname, 'manual.html' )
  })
]

if ( config.get( 'uglify' )) {
  plugins.push( new uglifyJsPlugin({
    sourceMap: config.get( 'sourcemap' )
  }))
}

/*-------------------------------------------------*/

module.exports = {
  mode: process.env.WEBPACK_SERVE ? 'development' : 'production',
  entry: './src/index.js',
  output: {
    library: 'JsonHelper',
    libraryTarget: 'umd',
    libraryExport: 'default',
    path: path.resolve( __dirname, 'dist' ),
    filename: 'json-schema-ui.js',
    publicPath: config.get( 'publicPath' )
  },
  devtool: 'eval-source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [ 'babel-loader' ]
      },
      {
        test: /\.scss$/,
        use: [ 'style-loader', 'css-loader', 'postcss-loader', 'sass-loader' ]
      }
    ]
  },
  plugins: plugins,
  devServer: {
    historyApiFallback: true,
    open: config.get( 'open' )
  },
  // serve: {
  //     host: '192.168.1.210'
  // }
}
