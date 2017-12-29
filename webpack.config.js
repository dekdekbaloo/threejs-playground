const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin')

const entries = {
  main: {
    js: './src/index.js',
    html: './src/index.html'
  },
  steer: {
    js: './src/steer/index.js'
  }
}

module.exports = {
  entry: Object.entries(entries)
    .reduce((entry, [ name, { js } ]) => {
      entry[name] = js
      return entry
    }, { }),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js'
  },
  devServer: {
    publicPath: '/',
    contentBase: path.resolve(__dirname, './dist'),
    port: 8000,
    inline: true
  },
  plugins: [
    ...Object.entries(entries).map(([ name, { html } ]) => {
      const options = {
        title: `${name} | threejs playground`,
        filename: path.join(name === 'main' ? '' : name, 'index.html'),
        chunks: [ name ],
        alwaysWriteToDisk: true
      }
      if (html) options.html = html
      return new HtmlWebpackPlugin(options)
    }),
    new HtmlWebpackHarddiskPlugin()
  ]
}
