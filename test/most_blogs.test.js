const listHelper = require('../utils/list_helper')

describe('most blogs test', () => {

  const blogList1 = [
    {
      author: "a"
    }
  ]

  test('one blog', () => {
    expect(listHelper.mostBlogs(blogList1)).toEqual({author: "a", count: 1})
  })

  const blogList2 = [
    {author: "a"},
    {author: "b"},
    {author: "a"},
    {author: "c"}
  ]
  test('multiple blogs', () => {
    expect(listHelper.mostBlogs(blogList2)).toEqual({author: "a", count: 2})
  })

  const blogListEmpty = []

  test('empty list', () => {
    expect(listHelper.mostBlogs(blogListEmpty)).toEqual(undefined)
  })
})
