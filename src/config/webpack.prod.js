const HtmlMinimizerPlugin = require(`html-minimizer-webpack-plugin`);
const MiniCssExtractPlugin = require(`mini-css-extract-plugin`);
const CssMinimizerPlugin = require(`css-minimizer-webpack-plugin`);
const JsonMinimizerPlugin = require(`json-minimizer-webpack-plugin`);
const TerserPlugin = require(`terser-webpack-plugin`);
const FileManagerPlugin = require(`filemanager-webpack-plugin`);
const { merge } = require(`webpack-merge`);
const baseConfig = require(`./webpack.common.js`);

module.exports = merge(baseConfig, {
  mode: `production`,
  module: {
    rules: [
      {
        test: /.s?css$/,
        use: [MiniCssExtractPlugin.loader, `css-loader`, `sass-loader`],
      },
    ],
  },
  optimization: {
    minimize: true,
    minimizer: [
      new HtmlMinimizerPlugin(),
      new CssMinimizerPlugin(),
      new TerserPlugin({
        minify: TerserPlugin.uglifyJsMinify,
        terserOptions: {
          compress: {
            drop_console: true,
          },
        },
      }),
      new JsonMinimizerPlugin(),
    ],
  },
  plugins: [
    new MiniCssExtractPlugin(),
    new FileManagerPlugin({
      events: {
        onEnd: {
          archive: [
            { source: `./build/chrome`, destination: `./build/chrome.zip` },
            { source: `./build/firefox`, destination: `./build/firefox.zip` },
          ],
        },
      },
    }),
  ],
});
