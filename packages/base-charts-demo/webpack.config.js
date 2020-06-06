const { resolve } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const isProd = process.env.NODE_ENV === 'production'; // eslint-disable-line

const baseConfig = {
  entry: {
    app: './src/index.js',
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
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Base Charts Demo',
      template: './index.html',
    }),
  ],
};

const prodConfig = {
  ...baseConfig,
};

const devConfig = {
  ...baseConfig,
  devtool: 'eval-source-map',
};

module.exports = isProd ? prodConfig : devConfig;
