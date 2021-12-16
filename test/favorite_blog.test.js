const listHelper = require('../utils/list_helper')

describe('favorite blog test', () => {

  const blogList1 = [
    {
      likes: 10
    }
  ]

  test('one blog', () => {
    expect(listHelper.favoriteBlog(blogList1)).toEqual({likes: 10})
  })

  const blogList2 = [
    {likes: 10},
    {likes: 20},
    {likes: 10},
    {likes: 15}
  ]
  test('multiple blogs', () => {
    expect(listHelper.favoriteBlog(blogList2)).toEqual({likes: 20})
  })

  const blogListEmpty = []

  test('empty list', () => {
    expect(listHelper.favoriteBlog(blogListEmpty)).toEqual(undefined)
  })
})
