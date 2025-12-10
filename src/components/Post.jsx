import PropTypes from 'prop-types'
import { User } from './User.jsx'
import { Link } from 'react-router-dom'

import slug from 'slug'
import { useQuery } from '@tanstack/react-query'
import { getPostById } from '../api/posts.js'

export function Post({
  title,
  contents,
  author,
  imageURL,
  id,
  fullPost = false,
}) {
  const postQuery = useQuery({
    queryKey: ['post', id],
    queryFn: () => getPostById(id),
  })
  const post = postQuery.data
  return (
    <article>
      {fullPost ? (
        <h3>{title}</h3>
      ) : (
        <Link to={`/posts/${id}/${slug(title)}`}>
          <h3>{title}</h3>
        </Link>
      )}
      <div>{post?.likes} likes</div>
      <br />
      {fullPost && <div>{contents}</div>}
      <img src={imageURL} alt='Click here' width='300' height='300' />
      <br />
      {author && (
        <em>
          {fullPost && <br />}
          Posted by <User {...author} />
        </em>
      )}
    </article>
  )
}
Post.propTypes = {
  title: PropTypes.string.isRequired,
  contents: PropTypes.string,
  imageURL: PropTypes.string,
  author: PropTypes.shape(User.propTypes),
  id: PropTypes.string.isRequired,
  likes: PropTypes.number,
  fullPost: PropTypes.bool,
}
