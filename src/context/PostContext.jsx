import { createContext, useState, useEffect } from "react";

const PostContext = createContext();

const PostProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);

  // Load posts from localStorage
  useEffect(() => {
    const storedPosts = JSON.parse(localStorage.getItem("posts")) || [];
    setPosts(storedPosts);
  }, []);

  // Create a new post
  const createPost = (content, createdBy) => {
    const newPost = { id: Date.now(), content, createdBy, comments: [] };
    const updatedPosts = [...posts, newPost];

    setPosts(updatedPosts);
    localStorage.setItem("posts", JSON.stringify(updatedPosts));
  };

  // Add a comment to a post
  const addComment = (postId, comment, user) => {
    const updatedPosts = posts.map((post) =>
      post.id === postId
        ? { ...post, comments: [...post.comments, { comment, user, timestamp: Date.now() }] }
        : post
    );

    setPosts(updatedPosts);
    localStorage.setItem("posts", JSON.stringify(updatedPosts));
  };

  return (
    <PostContext.Provider value={{ posts, createPost, addComment }}>
      {children}
    </PostContext.Provider>
  );
};

export { PostContext, PostProvider };
