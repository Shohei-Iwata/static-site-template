module.exports = {
  mode: 'development',
  entry: './src/docroot/js/index.ts',
  output: {
    path: `${__dirname}/dist`,
    filename: 'index.js'
  },
  module: {
    rules: [
      {
        test: /.ts$/,
        use: 'ts-loader'
      }
    ]
  },
  resolve: {
    extensions: [
      '.ts','.js'
    ]
  }
}