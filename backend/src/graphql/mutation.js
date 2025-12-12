import { GraphQLError } from 'graphql';
import { createUser, loginUser } from '../services/users.js';
import { createPost, likePost } from '../services/posts.js';
import { sendSystemMessage } from '../services/chat.js';
export const mutationSchema = `#graphql
    type Mutation {
        signupUser(username: String!, password: String!): User
        loginUser(username: String!, password: String!): String
        createPost(title: String!, contents: String, imageURL: String, tags: [String]): Post
        likePost(postId: String!): Post
    }
`;
export const mutationResolver = {
  Mutation: {
    signupUser: async (parent, { username, password }) => {
      return await createUser({ username, password });
    },
    loginUser: async (parent, { username, password }) => {
      return await loginUser({ username, password });
    },
    createPost: async (
      parent,
      { title, contents, imageURL, tags },
      { auth, io },
    ) => {
      if (!auth) {
        throw new GraphQLError(
          'You need to be authenticated to perform this action.',
          {
            extensions: {
              code: 'UNAUTHORIZED',
            },
          },
        );
      }
      const post = await createPost(auth.sub, {
        title,
        contents,
        imageURL,
        tags,
      });

      if (io) {
        sendSystemMessage(io, {
          room: 'public',
          message: `New post: "${post.title}"`,
        });
      }

      return post;
    },
    likePost: async (parent, { postId }, { auth }) => {
      if (!auth) {
        throw new GraphQLError(
          'You need to be authenticated to perform this action.',
          {
            extensions: {
              code: 'UNAUTHORIZED',
            },
          },
        );
      }
      const updatedPost = await likePost(postId);
      if (!updatedPost) {
        throw new GraphQLError('Post not found', {
          extensions: {
            code: 'NOT_FOUND',
          },
        });
      }
      return updatedPost;
    },
  },
};
