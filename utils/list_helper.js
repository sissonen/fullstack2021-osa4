const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const reducer = (sum, item) => {
    return sum + item.likes
  }
  return blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
  const sortByLikes = (a, b) => {
    if (a.likes === b.likes) {
      return 0
    } else {
      return (a.likes > b.likes) ? -1 : 1
    }
  }
  blogs.sort(sortByLikes)
  return blogs[0]
}

module.exports = { dummy, totalLikes, favoriteBlog }
