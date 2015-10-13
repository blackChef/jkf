module.exports = {
  entry: './src/index.jsx',
  output: {
    filename: './dist/jkf.js',
    library: "Jkf",
    libraryTarget: "umd"
  },

 module: {
    loaders: [
     { test: /\.jsx?$/,
       exclude: /(node_modules|bower_components)/,
       loader: 'babel'
     },
    ]
  }
};