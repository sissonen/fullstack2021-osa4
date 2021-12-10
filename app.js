const config = require('./utils/config')
const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')

console.log('Connecting to', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI)
  .then(() => {
    console.log('Connection to DB successful')
  })
  .catch((error) => {
    console.error('Connection to DB failed:', error.message)
  })

app.use(cors())
app.use(express.json())

module.exports = app