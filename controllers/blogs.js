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

blogsRouter.delete('/:id', async (request, response) => {
  try {
    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
  } catch (exception) {
    console.log('Find and remove failed for id ' + request.params.id, exception)
  }
})

module.exports = blogsRouter
