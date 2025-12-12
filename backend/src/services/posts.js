import { Post } from '../db/models/post.js';
import { User } from '../db/models/user.js';
//import { useChat } from '../../../src/hooks/useChat.js';

export async function createPost(userId, { title, contents, imageURL, tags }) {
  const post = new Post({
    title,
    author: userId,
    contents,
    imageURL,
    tags,
    likes: 0,
  });
  return await post.save();
}

async function listPosts(
  query = {},
  { sortBy = 'createdAt', sortOrder = 'descending' } = {},
) {
  return await Post.find(query).sort({ [sortBy]: sortOrder });
}

export async function listAllPosts(options) {
  return await listPosts({}, options);
}

export async function listPostsByAuthor(authorUsername, options) {
  const user = await User.findOne({ username: authorUsername });
  if (!user) return [];
  return await listPosts({ author: user._id }, options);
}

export async function listPostsByTag(tags, options) {
  return await listPosts({ tags }, options);
}

export async function getPostById(postId) {
  return await Post.findById(postId);
}

export async function updatePost(
  userId,
  postId,
  { title, contents, imageURL, tags, likes },
) {
  return await Post.findOneAndUpdate(
    { _id: postId, author: userId },
    { $set: { title, contents, imageURL, tags, likes } },
    { new: true },
  );
}

export async function likePost(userId, postId, likes) {
  return await Post.findOneAndUpdate(
    { _id: postId, author: userId },
    { likes: likes + 1 },
    { new: true },
  );
}

export async function deletePost(userId, postId) {
  return await Post.deleteOne({ _id: postId, author: userId });
}
