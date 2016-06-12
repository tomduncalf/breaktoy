module.exports = {
  entry: 'app.tsx',
  output: {
    filename: 'dist/app.js'
  },
  resolve: {
    extensions: ['', '.ts', '.tsx', '.js', '.jsx'],
    root: ['src'],
    modulesDirectories: ['src', 'node_modules'],
  },
  module: {
    loaders: [
      { test: /\.tsx?$/, loader: 'ts-loader' }
    ]
  }
}
