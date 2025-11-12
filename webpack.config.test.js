const path = require('path');
const webpack = require('webpack');

module.exports = {
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.ts$/,
        include: [path.join(__dirname, 'src'), path.join(__dirname, 'test')],
        use: ['babel-loader'],
      },
      {
        test: /\.js$/,
        use: ['source-map-loader'],
        enforce: 'pre',
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
    fallback: {
      "path": require.resolve("path-browserify"),
      "stream": require.resolve("stream-browserify"),
      "assert": require.resolve("assert/"),
      "os": require.resolve("os-browserify/browser"),
    }
  },
  externals: {
    jsforce: 'jsforce',
  },
  devtool: 'inline-source-map',
  plugins: [
    new webpack.ProvidePlugin({
      process: 'process/browser'
    }),
    new webpack.EnvironmentPlugin({
      'SF_LOGIN_URL': '',
      'SF_USERNAME': '',
      'SF_PASSWORD': '',
      'SF_ACCESS_TOKEN': '',
      'SF_OAUTH2_CLIENT_ID': '',
      'SF_OAUTH2_CLIENT_SECRET': '',
      'SF_OAUTH2_REDIRECT_URI': '',
      'SF_AJAX_PROXY_URL': '',
      'DEBUG': '',
    }),
  ],
};
