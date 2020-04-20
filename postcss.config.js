module.exports = {
    plugins: {
      'autoprefixer': {},
      'postcss-import': {
        browsers: ['> 1%', 'last 2 versions']},
      'postcss-preset-env': {},
      'cssnano': {}
    }
  }