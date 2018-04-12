// var DtsBundlerPlugin = require('dtsbundler-webpack-plugin');
const DtsBundleWebpack = require('dts-bundle-webpack');
var path = require('path');


// function DtsBundlePlugin(){}
// DtsBundlePlugin.prototype.apply = function (compiler) {
//   compiler.plugin('done', function(){
//     var dts = require('dts-bundle');
//     dts.bundle({
//       name: 'tsjson',
//       main: './dist/src/index.d.ts',
//       out: '../bundle.d.ts',
//       removeSource: true,
//       outputAsModuleFolder: false // to use npm in-package typings
//     });
    
//     // Delete unneeded files
    
//   });
// };

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
    // new DtsBundlerPlugin({
    //   out:'./dist/bundle.d.ts',
    // })
    new DtsBundleWebpack({
      name: 'tsjson',
      main: path.resolve(__dirname, 'dist', 'src', 'index.d.ts'),
      // baseDir: pa,
      out: path.resolve(__dirname, 'dist', 'src', 'out', 'out', 'bundle.d.ts'),
      // removeSource: true,
      // externals: true
      referenceExternals: true
      // outputAsModuleFolder: true // to use npm in-package typings
    })
    // new DtsBundlePlugin()
  ]
}