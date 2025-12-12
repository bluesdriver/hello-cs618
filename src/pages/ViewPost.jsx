import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Header } from '../components/Header.jsx';
import { Post } from '../components/Post.jsx';
import { getPostById, likePost } from '../api/posts.js';
import { useEffect, useState } from 'react';
import { postTrackEvent } from '../api/events.js';
import { getUserInfo } from '../api/users.js';
import { PostStats } from '../components/PostStats.jsx';

import { Helmet } from 'react-helmet-async';
import { useAuth } from '../contexts/AuthContext.jsx';

export function ViewPost({ postId }) {
  const [session, setSession] = useState();
  const [token] = useAuth();

  useEffect(() => {
    let timeout = setTimeout(() => {
      postTrackEvent({ postId, action: 'startView', session }).then((data) =>
        setSession(data?.session),
      );
      timeout = null;
    }, 1000);
    return () => {
      if (timeout) clearTimeout(timeout);
      else postTrackEvent({ postId, action: 'endView', session });
    };
  }, []);

  const postQuery = useQuery({
    queryKey: ['post', postId],
    queryFn: () => getPostById(postId),
  });
  const post = postQuery.data;

  const likeMutation = useMutation({
    mutationFn: () => likePost(token, postId),
    onSuccess: () => {
      postQuery.refetch();
    },
  });

  const userInfoQuery = useQuery({
    queryKey: ['users', post?.author],
    queryFn: () => getUserInfo(post?.author),
    enabled: Boolean(post?.author),
  });
  const userInfo = userInfoQuery.data ?? {};

  function truncate(str, max = 160) {
    if (!str) return str;
    if (str.length > max) {
      return str.slice(0, max - 3) + '...';
    } else {
      return str;
    }
  }

  return (
    <div style={{ padding: 8 }}>
      {post && (
        <Helmet>
          <title>{post.title} | Full-Stack React Blog</title>
          <meta name='description' content={truncate(post.contents)} />
          <meta property='og:type' content='article' />
          <meta property='og:title' content={post.title} />
          <meta property='og:article:published_time' content={post.createdAt} />
          <meta property='og:article:modified_time' content={post.updatedAt} />
          <meta property='og:article:author' content={userInfo.username} />
          {(post.tags ?? []).map((tag) => (
            <meta key={tag} property='og:article:tag' content={tag} />
          ))}
        </Helmet>
      )}
      <Header />
      <br />
      <hr />
      <Link to='/'>Back to main page</Link>
      <br />
      <hr />
      <button
        onClick={() => {
          if (!token) alert('Please log in to like recipes.');
          else {
            likeMutation.mutate();
          }
        }}
        disabled={likeMutation.isPending}
      >
        {likeMutation.isPending ? 'Liking...' : 'Like this recipe'}
      </button>
      {likeMutation.isError && (
        <div style={{ color: 'red', marginTop: '10px' }}>
          Error: {likeMutation.error?.message}
        </div>
      )}
      <br />
      {post ? (
        <div>
          <Post {...post} author={userInfo} fullPost id={postId} />
          <hr />
          <PostStats postId={postId} />
        </div>
      ) : (
        `Post with id ${postId} not found.`
      )}
    </div>
  );
}

ViewPost.propTypes = {
  postId: PropTypes.string.isRequired,
};
