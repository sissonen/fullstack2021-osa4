const blogsRouter = require('express').Router()
const jwt = require('jsonwebtoken')

const Blog = require('../models/blog')
const User = require('../models/user')
const config = require('../utils/config')

const getToken = request => {
  const auth = request.get('authorization')
  if (auth && auth.toLowerCase().startsWith('bearer ')) {
    return auth.substring(7)
  }
  return null
}

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  
  const token = getToken(request)
  if (!token) {
    return response.status(401).json({ error: 'Token is missing' })
  }
  const tokenDecoded = jwt.verify(token, config.SECRET)
  if (!tokenDecoded.id) {
    return response.status(401).json({ error: 'Token is invalid' })
  }
  const user = await User.findById(tokenDecoded.id)
  const userId = tokenDecoded.id

  if (!user) {
    return response.status(401).json({ error: 'No user matching token found' })
  }
  
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
