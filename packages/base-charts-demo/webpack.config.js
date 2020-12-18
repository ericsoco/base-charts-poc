const { resolve } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { DefinePlugin } = require('webpack');

const baseConfig = envvars => ({
  entry: {
    app: './src/index.js',
  },
  output: {
    path: resolve(__dirname, 'dist'),
    filename: '[name].bundle.js',
    publicPath: envvars.ASSET_PATH,
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
    // Make env vars (including from .env files) available in browser
    new DefinePlugin({
      'process.env': JSON.stringify(envvars),
    }),
  ],
});

const prodConfig = envvars => ({
  ...baseConfig(envvars),
});

const devConfig = envvars => ({
  ...baseConfig(envvars),
  devtool: 'eval-source-map',
  devServer: {
    historyApiFallback: true,
  },
});

module.exports = (env, argv) => {
  const isProd = argv.mode === 'production';

  // Hydrate env vars with vars in .env file per NODE_ENV
  require('dotenv').config({
    path: `${__dirname}/.env${isProd ? '' : '.development'}`,
  });

  const config = isProd ? prodConfig(process.env) : devConfig(process.env);

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
