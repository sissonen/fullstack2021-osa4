const supertest = require('supertest')
const mongoose = require('mongoose')
//const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const User = require('../models/user')

beforeEach(async () => {
  await User.deleteMany({})
  //await User.insertMany(helper.testUsers)
})

test('fail to create user: short username', async () => {
  
  const testUser = {
    username: 't',
    name: 'Test 1',
    password: 'abcd'
  }
  const response = await api
    .post('/api/users')
    .send(testUser)
    .expect(400)
  
  expect(response.body.error).toContain('Failed to save user')

})

test('fail to create user: short password', async () => {
  
  const testUser = {
    username: 'test2',
    name: 'Test 2',
    password: 'a'
  }
  const response = await api
    .post('/api/users')
    .send(testUser)
    .expect(400)
  
  expect(response.body.error).toContain('Password needs to be at least 3')

})

test('fail to create user: duplicate username', async () => {
  
  const testUser = {
    username: 'test3',
    name: 'Test 3',
    password: 'abcd'
  }
  const resp1 = await api
    .post('/api/users')
    .send(testUser)
    .expect(201)

  const response = await api
    .post('/api/users')
    .send(testUser)
    .expect(400)
  
  await expect(response.body.error).toContain('Failed to save user')

})

afterAll(() => {
  mongoose.connection.close()
})
