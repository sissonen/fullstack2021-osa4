const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  if (typeof request.body.title === 'undefined' && typeof request.body.url === 'undefined') {
    response.status(400).end()
  } else {
    const blog = new Blog(request.body)

    const result = await blog.save()
    response.status(201).json(result)
  }
})

module.exports = blogsRouter
