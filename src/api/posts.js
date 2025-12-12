import { useChat } from '../hooks/useChat';

export const getPosts = async (queryParams) => {
  const res = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/posts?` +
      new URLSearchParams(queryParams),
  );
  return await res.json();
};

export const getPostById = async (postId) => {
  const res = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/posts/${postId}`,
  );
  return await res.json();
};

export const createPost = async (token, post) => {
  const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/posts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(post),
  });
  const { messages, sendMessage } = useChat();
  const creationMessage = "Hey there's a new post!!";
  messages;
  sendMessage(creationMessage);
  return await res.json();
};
