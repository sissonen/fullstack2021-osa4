const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  
  const randUser = await User.find({})
  if (randUser[0] === 'undefined') {
    return response.status(400).json({ error: 'No user defined' })
  }
  const user = randUser[0]
  const userId = randUser[0].id
  
  if (typeof request.body.title === 'undefined' && typeof request.body.url === 'undefined') {

    return response.status(400).end()

  } else {

    const blog = new Blog({
      author: request.body.author,
      title: request.body.title,
      url: request.body.url,
      user: userId
    })

    const savedBlog = await blog.save()

    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    response.status(201).json(savedBlog)

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

blogsRouter.put('/:id', async (request, response) => {
  
  const blog = request.body
  
  try {
    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
    response.json(updatedBlog)
  } catch (exception) {
    console.log('Find and update failed for id ' + request.params.id, exception)
  }

})

module.exports = blogsRouter
