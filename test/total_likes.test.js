const listHelper = require('../utils/list_helper')

describe('total likes', () => {
  const listWithOneBlog = [
    {
      likes: 10
    }
  ]

  test('one blog', () => {
    expect(listHelper.totalLikes(listWithOneBlog)).toBe(10)
  })

  const listWithMoreBlogs = [
    {
      likes: 5
    },
    {
      likes: 10
    },
    {
      likes: 15
    }
  ]

  test('many blogs', () => {
    expect(listHelper.totalLikes(listWithMoreBlogs)).toBe(30)
  })
})
