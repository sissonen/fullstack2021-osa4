const blogsRouter = require('express').Router()

const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  
  const user = request.user

  console.log(user)
  if (user === null) {
    return response.status(401).json({ error: 'Invalid user' })
  }

  const userId = user._id

  if ((typeof request.body.title === 'undefined' || !request.body.title) && (typeof request.body.url === 'undefined' || !request.body.url)) {

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

    await User.findOneAndUpdate({id: user.id}, { blogs: user.blogs.concat(savedBlog._id) })

    const populatedBlog = await Blog.populate(savedBlog, { path: 'user', select: [ 'username', 'name' ]})

    response.status(201).json(populatedBlog)

  }
})

blogsRouter.delete('/:id', async (request, response) => {
  
  const user = request.user
  if (user === null) {
    return response.status(401).json({ error: 'Invalid user' })
  }
  const userId = user._id

  try {
    const blogCheck = await Blog.findById(request.params.id)
    
    if (blogCheck && blogCheck.user.toString() === userId.toString()) {

      await Blog.findByIdAndRemove(request.params.id)
      user.blogs.splice(user.blogs.indexOf(request.params.id), 1)
      await User.findOneAndUpdate({id: user.id}, { blogs: user.blogs })
      
      response.status(204).end()

    } else {
      response.status(401).json({ error: 'Unauthorized removal or invalid blog id' })
    }

  } catch (exception) {
    response.status(401).json({ error: 'Delete failed ' + exception })
    console.log('Find and remove failed for id ' + request.params.id, exception)
  }
})

blogsRouter.put('/:id', async (request, response) => {
  
  const blog = request.body
  
  try {
    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
    const populatedBlog = await Blog.populate(updatedBlog, { path: 'user', select: [ 'username', 'name' ]})
    response.json(populatedBlog)
  } catch (exception) {
    console.log('Find and update failed for id ' + request.params.id, exception)
  }

})

module.exports = blogsRouter
