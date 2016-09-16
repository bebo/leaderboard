var webpack = require('webpack');

module.exports = {
  bail: true,
  devtool: 'source-map',
  entry: ['./leaderboard.js'],
  output: {
    path: __dirname+'/dist/',
    filename: "leaderboard.min.js",
    publicPath: '/'
  },
  module: {
    loaders: [{
      test: /\.js$/,
      loader: 'babel',
      exclude: /node_modules/,
      query: {
        presets: ['es2015']
      }
    }]
  },
  plugins: [
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.AggressiveMergingPlugin()
  ]
};
