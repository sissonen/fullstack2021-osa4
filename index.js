const app = require('./app')
const http = require('http')
const config = require('./utils/config')
const mongoose = require('mongoose')

app.listen(config.PORT, () => {
  console.log('Server running on port', config.PORT)
})
