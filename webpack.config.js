const TerserPlugin = require("terser-webpack-plugin");
const webpack = require('webpack');

module.exports = {
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
        AUTH_SERVER_URL: JSON.stringify(process.env.REACT_APP_AUTH_SERVER_URL),
        DEFAULT_TOKEN: JSON.stringify(process.env.DEFAULT_TOKEN),
        SHOW_VERSION_INFO: JSON.stringify(process.env.SHOW_VERSION_INFO),
      },
    }),
  ],
};