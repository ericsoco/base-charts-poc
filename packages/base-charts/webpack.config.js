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
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            // Use root babel.config.json
            rootMode: 'upward',
          },
        },
      },
    ],
  },
  // TODO: Move nivo to peerDependencies and externalize it
  // to reduce bundle size
  // https://webpack.js.org/guides/author-libraries/#externalize-lodash
};
