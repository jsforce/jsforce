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
    }
  },
  externals: {
    jsforce: 'jsforce',
  },
  devtool: 'inline-source-map',
  plugins: [
    new webpack.EnvironmentPlugin([
      'SF_LOGIN_URL',
      'SF_POOL_CLIENT',
      'SF_POOL_USERNAME',
      'SF_POOL_PASSWORD',
      'SF_USERNAME',
      'SF_PASSWORD',
      'SF_OAUTH2_CLIENT_ID',
      'SF_OAUTH2_CLIENT_SECRET',
      'SF_OAUTH2_REDIRECT_URI',
      'SF_AJAX_PROXY_URL',
      'DEBUG',
    ]),
  ],
};
