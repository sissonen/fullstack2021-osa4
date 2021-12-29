const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user')
const config = require('../utils/config')

loginRouter.post('/', async (request, response) => {
  const user = await User.findOne({ username: request.body.username })
  
  let passCorrect = false
  if (user !== null) {
    passCorrect = await bcrypt.compare(request.body.password, user.passwordHash)
  } else {
    passCorrect = false
    console.log('No user found')
  }

  if (!passCorrect) {
    return response.status(401).json({ error: 'Invalid username or password' })
  }

  const userInfo = {
    username: user.username,
    id: user._id
  }

  const token = jwt.sign(userInfo, config.SECRET)

  response.status(200).send({ token, username: user.username, name: user.name })

})

module.exports = loginRouter
