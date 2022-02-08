const path = require(`path`);
const CopyPlugin = require(`copy-webpack-plugin`);
const FileManagerPlugin = require(`filemanager-webpack-plugin`);

module.exports = {
  entry: {
    nattynote: `./src/nattynote.js`,
    "scripts/cached": `./src/scripts/cached.js`,
    "scripts/nattybox": `./src/scripts/nattybox.js`,
  },
  output: {
    filename: `[name].js`,
    path: path.resolve(__dirname, `../dist`),
    publicPath: `./`,
  },
  module: {
    rules: [
      {
        test: /\.svg$/,
        use: [
          {
            loader: `raw-loader`,
          },
        ],
      },
    ],
  },
  plugins: [
    new CopyPlugin({
      patterns: [{from: `public`}],
    }),
    new FileManagerPlugin({
      events: {
        onEnd: {
          copy: [
            {
              source: `./manifest/chrome.json`,
              destination: `./build/chrome/manifest.json`,
            },
            {source: `./dist/`, destination: `./build/chrome/`},
            {
              source: `./manifest/firefox.json`,
              destination: `./build/firefox/manifest.json`,
            },
            {source: `./dist/`, destination: `./build/firefox/`},
          ],
        },
      },
    }),
  ],
};
