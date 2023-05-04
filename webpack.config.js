const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  resolve: {
    fallback: {
      "querystring": require.resolve("querystring-es3"),
      "crypto": require.resolve("crypto-browserify"),
      "stream": require.resolve("stream-browserify"),
      "timers": require.resolve("timers-browserify"),
      "util": require.resolve("util"),
    }
  },
  entry: {
    jsforce: '.',
    'jsforce.min': '.',
    'jsforce-core': './core',
    'jsforce-core.min': './core',
  },
  output: {
    library: 'jsforce',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: ['source-map-loader'],
        enforce: 'pre',
      },
    ],
  },
  devtool: 'source-map',
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        include: /\.min\.js$/,
      }),
    ],
  },
};
