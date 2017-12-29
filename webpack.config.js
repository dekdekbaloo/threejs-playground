const path = require('path')
const chalk = require('chalk')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin')

const entries = {
  main: {
    js: './src/index.js',
    html: './src/index.html'
  },
  steer: {
    js: './src/steer/index.js',
    html: './src/steer/index.html'
  }
}
function generateEntryPoints (entries) {
  console.log('. Generating entry points.')
  return Object.entries(entries)
    .reduce((entry, [ name, { js } ]) => {
      console.log(chalk.cyan('entry:'), name, chalk.cyan('js:'), js)
      entry[name] = js
      return entry
    }, { })
}
function generateHtmlWebpackPlugins (entries) {
  console.log('. Generating html webpack plugins')
  return Object.entries(entries).map(([ name, { html } ]) => {
    const options = {
      title: `${name} | threejs playground`,
      filename: path.join(name === 'main' ? '' : name, 'index.html'),
      chunks: [ name ],
      alwaysWriteToDisk: true
    }
    if (html) options.template = html
    console.log(chalk.cyan('entry:'), name, chalk.cyan('options:\n'), options)
    return new HtmlWebpackPlugin(options)
  })
}
module.exports = {
  entry: generateEntryPoints(entries),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js'
  },
  module: {
    rules: [
      {
        test: /.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env'],
            plugins: [
              'syntax-flow',
              'tcomb',
              'transform-flow-strip-types'
            ]
          }
        }
      }
    ]
  },
  devServer: {
    publicPath: '/',
    contentBase: path.resolve(__dirname, './dist'),
    port: 8000,
    inline: true
  },
  devtool: process.env.NODE_ENV === 'development' ? 'eval-source-map' : false,
  plugins: [
    ...generateHtmlWebpackPlugins(entries),
    new HtmlWebpackHarddiskPlugin()
  ]
}
