const testingRouter = require('express').Router()
const User = require('../models/user')
const Blog = require('../models/blog')

testingRouter.get('/reset', async (request, response) => {

  await User.deleteMany({})
  await Blog.deleteMany({})
  response.status(201).send('Reset done.')

})

module.exports = testingRouter
