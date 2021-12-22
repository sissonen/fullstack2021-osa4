const blogsRouter = require('express').Router()
const jwt = require('jsonwebtoken')

const Blog = require('../models/blog')
const User = require('../models/user')
const config = require('../utils/config')

const verifyUser = async (request, response) => {

  if (!request.token) {
    response.status(401).json({ error: 'Token is missing' })
    return null
  }
  
  let tokenDecoded
  try {
    tokenDecoded = jwt.verify(request.token, config.SECRET)
  } catch (exception) {
    response.status(401).json({ error: 'Token verification failed' })
    return null
  }
  if (!tokenDecoded.id) {
    response.status(401).json({ error: 'Token is invalid' })
    return null
  }
  
  const user = await User.findById(tokenDecoded.id)

  if (!user) {
    response.status(401).json({ error: 'No user matching token found' })
    return null
  }

  return user
  
}

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  
  const user = await verifyUser(request, response)

  if (user === null) {
    return response.status(401).end()
  }

  const userId = user.id

  if (typeof request.body.title === 'undefined' && typeof request.body.url === 'undefined') {

    return response.status(400).end()

  } else {

    const blog = new Blog({
      author: request.body.author,
      title: request.body.title,
      url: request.body.url,
      likes: request.body.likes,
      user: userId
    })

    const savedBlog = await blog.save()

    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    response.status(201).json(savedBlog)

  }
})

blogsRouter.delete('/:id', async (request, response) => {
  
  const user = await verifyUser(request, response)
  if (user === null) {
    return response.status(401).end()
  }
  const userId = user.id

  try {
    const blogCheck = await Blog.findById(request.params.id)
    console.log(blogCheck, userId.toString())
    if (blogCheck && blogCheck.user.toString() === userId.toString()) {
      await Blog.findByIdAndRemove(request.params.id)
      response.status(204).end()
    } else {
      response.status(401).json({ error: 'Unauthorized removal or invalid blog id' })
    }
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
