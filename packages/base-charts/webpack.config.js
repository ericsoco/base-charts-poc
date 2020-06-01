const { resolve } = require('path');

module.exports = {
  entry: {
    lib: './src/index.js',
  },
  output: {
    path: resolve(__dirname, 'dist'),
    filename: '[name].bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
    ],
  },
};

// TODO: add nivo and d3-array as externals
// https://webpack.js.org/guides/author-libraries/
