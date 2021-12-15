const listHelper = require('../utils/list_helper')

describe('most liked blog test', () => {

  const blogList1 = [
    {author: "a", likes: 4}
  ]

  test('one blog', () => {
    expect(listHelper.mostLikes(blogList1)).toEqual({author: "a", likes: 4})
  })

  const blogList2 = [
    {author: "a", likes: 4},
    {author: "b", likes: 1},
    {author: "a", likes: 3},
    {author: "c", likes: 10}
  ]
  test('multiple blogs', () => {
    expect(listHelper.mostLikes(blogList2)).toEqual({author: "c", likes: 10})
  })

  const blogListEmpty = []

  test('empty list', () => {
    expect(listHelper.mostLikes(blogListEmpty)).toEqual(undefined)
  })
})
