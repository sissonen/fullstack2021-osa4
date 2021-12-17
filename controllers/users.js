const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('blogs', { author: 1, title: 1, likes: 1 })
  response.json(users)
})

usersRouter.post('/', async (request, response) => {
  
  if (request.body.password.length < 3) {
    return response.status(400).json({ error: 'Password needs to be at least 3 characters long.' })
  }
  const passHash = await bcrypt.hash(request.body.password, 10)
  const user = new User({
    username: request.body.username,
    name: request.body.name,
    passwordHash: passHash
  })

  try {
    const result = await user.save()
    response.status(201).json(result)
  } catch (exception) {
    if (!response.headersSent) {
      response.status(400).json({ error: 'Failed to save user: ' + exception })
    } else {
      console.log(exception)
    }
  }
})

/*blogsRouter.delete('/:id', async (request, response) => {
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

})*/

module.exports = usersRouter
