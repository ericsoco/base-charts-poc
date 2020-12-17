const { resolve } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const baseConfig = {
  entry: {
    app: './src/index.js',
  },
  output: {
    path: resolve(__dirname, 'dist'),
    filename: '[name].bundle.js',
    publicPath: '/',
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
  devServer: {
    historyApiFallback: true,
  },
};

module.exports = (env, argv) => {
  const isProd = argv.mode === 'production';
  const config = isProd ? prodConfig : devConfig;

  const runBundleAnalyzer = typeof argv.analyze !== 'undefined';

  if (runBundleAnalyzer) {
    const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
      .BundleAnalyzerPlugin;
    return {
      ...config,
      plugins: [...(config.plugins || []), new BundleAnalyzerPlugin()],
    };
  }
  return config;
};
