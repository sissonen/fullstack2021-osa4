const User = require('../models/user')
const jwt = require('jsonwebtoken')
const config = require('../utils/config')

const userExtractor = async (request, response, next) => {

  if (!request.token) {
    request.user = null
    next()
    return
  }
  
  let tokenDecoded
  try {
    tokenDecoded = jwt.verify(request.token, config.SECRET)
  } catch (exception) {
    request.user = null
    next()
    return
  }
  if (!tokenDecoded || !tokenDecoded.id) {
    request.user = null
    next()
    return
  }
  
  const allusers = await User.find({}).exec()
  request.user = await User.findById(tokenDecoded.id).exec()

  next()

}

const tokenExtractor = (request, response, next) => {

  const auth = request.get('authorization')
  if (auth && auth.toLowerCase().startsWith('bearer ')) {
    request.token = auth.substring(7)
  } else {
    request.token = null
  }

  next()
  
}

module.exports = { tokenExtractor, userExtractor }
