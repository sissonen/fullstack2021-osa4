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

const mostBlogs = (blogs) => {
  const reducer = (arr, item) => {
    return arr.concat(item.author)
  }
  let blogAuthors = blogs.reduce(reducer, [])
  let blogsUniqAuthors = [ ... new Set(blogAuthors)]
  let blogsCount = []
  blogsUniqAuthors.forEach(
    blogAuthor => 
      blogsCount = blogsCount.concat({author: blogAuthor, count: blogs.filter(blog => blog.author === blogAuthor).length})
  )
  blogsCount.sort((a, b) => {return b.count - a.count})
  return blogsCount[0]
}

const mostLikes = (blogs) => {
  const authorReducer = (arr, item) => {
    return arr.concat(item.author)
  }
  const likesReducer = (sum, item) => {
    return sum + item.likes
  }
  let blogAuthors = blogs.reduce(authorReducer, [])
  let blogsUniqAuthors = [ ... new Set(blogAuthors)]
  let blogLikesCount = []
  blogsUniqAuthors.forEach(
    blogAuthor => 
      blogLikesCount = blogLikesCount.concat({author: blogAuthor, likes: blogs.filter(blog => blog.author === blogAuthor).reduce(likesReducer, 0)})
  )
  blogLikesCount.sort((a, b) => { return b.likes - a.likes })
  return blogLikesCount[0]
}

module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes }
