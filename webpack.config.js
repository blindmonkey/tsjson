const DtsBundleWebpack = require('dts-bundle-webpack');
var path = require('path');

module.exports = {
  entry: './dist/src/index.js',
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: [ '.js' ],
    alias: {
        'readers': path.resolve(__dirname, 'dist', 'src', 'readers'),
        'errors': path.resolve(__dirname, 'dist', 'src', 'errors'),
        'result': path.resolve(__dirname, 'dist', 'src', 'result'),
    }
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  plugins: [
    new DtsBundleWebpack({
      name: 'tsjson',
      main: './dist/src/index.d.ts',
      out: path.resolve(__dirname, 'dist', 'bundle.d.ts')
    })
  ]
}