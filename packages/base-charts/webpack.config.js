const { resolve } = require('path');

const baseConfig = {
  entry: {
    lib: './src/index.js',
  },
  output: {
    path: resolve(__dirname, 'dist'),
    filename: '[name].bundle.js',
    library: 'base-charts',
    libraryTarget: 'umd',
    // Webpack adds a `window` reference in `target:web` bundles,
    // which precludes their use in universal apps (bundle cannot be
    // imported in a node env). Until a `universal` target is available,
    // this workaround conditionally provides `window`.
    // Note this appears to cause mismatch between server- and client-rendered
    // markup, so universal consumer apps will warn on client hydration.
    // https://github.com/webpack/webpack/issues/6525#issuecomment-552140798
    globalObject: `(() => {
        if (typeof self !== 'undefined') {
            return self;
        } else if (typeof window !== 'undefined') {
            return window;
        } else if (typeof global !== 'undefined') {
            return global;
        } else {
            return Function('return this')();
        }
    })()`,
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
  externals: {
    react: {
      commonjs: 'react',
      commonjs2: 'react',
      amd: 'react',
    },
  },
  // TODO: Move nivo to peerDependencies and externalize it
  // to reduce bundle size
  // https://webpack.js.org/guides/author-libraries/#externalize-lodash
};

const prodConfig = {
  ...baseConfig,
  devtool: 'source-map',
};

const devConfig = {
  ...baseConfig,
  devtool: 'inline-source-map',
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
