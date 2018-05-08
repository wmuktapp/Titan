var webpack = require('webpack');
var path = require('path');

var BUILD_DIR = path.resolve(__dirname, 'datalake/static/scripts/public');
var APP_DIR = path.resolve(__dirname, 'datalake/static/scripts/app');

var config = {
  entry: {
    monitoring: APP_DIR + '/monitoring.jsx'
  },
  output: {
    path: BUILD_DIR,
    filename: '[name].js'
  },
  module : {
    rules : [
      {
        test : /\.jsx?/,
        include : APP_DIR,
        loader : 'babel-loader'
      }
    ]
  }
};

module.exports = config;