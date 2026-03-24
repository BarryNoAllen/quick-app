const webpack = require('webpack')

module.exports = {
  plugins: [
    new webpack.DefinePlugin({
      'ENV_TYPE': JSON.stringify(process.env.ENV_TYPE || 'development')
    })
  ]
}