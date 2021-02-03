const path = require('path')

module.exports = {
  outputDir: path.resolve(__dirname, '../server/public'),
  devServer: {
    proxy: {
      '/checkUser': {
        target: 'http://localhost:3000/'
      },
      '/api/notes': {
        target: 'http://localhost:3000'
      },
      '/auth': {
        target: 'http://localhost:3000'
      }
    }
  }
}
