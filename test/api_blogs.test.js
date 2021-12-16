const supertest = require('supertest')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.testBlogs)
})

test('blog list', async () => {
  
  const response = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
  expect(response.body).toHaveLength(helper.testBlogs.length)

})

test('id is defined', async () => {
  
  const response = await api
    .get('/api/blogs')
  expect(response.body[0].id).toBeDefined()

})

test('blog addition', async () => {
  
  const testEntry = {
    author: 'Test 1',
    title: 'Test 1',
    url: 'test1.com',
    likes: 1
  }

  await api
    .post('/api/blogs')
    .send(testEntry)
    .expect(201)

  const response = await api.get('/api/blogs')
  
  expect(response.body).toHaveLength(helper.testBlogs.length + 1)

  const authors = response.body.map(blog => blog.author)
  expect(authors).toContain(testEntry.author)

})

test('undefined likes', async () => {
  const testEntry = {
    author: 'Test 2',
    title: 'Test 2',
    url: 'test2.com'
  }
  const response = await api
    .post('/api/blogs')
    .send(testEntry)
    .expect(201)
  
  expect(response.body.likes).toBe(0)
  
})

afterAll(() => {
  mongoose.connection.close()
})