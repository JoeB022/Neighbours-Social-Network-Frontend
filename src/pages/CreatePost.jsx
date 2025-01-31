import { useState, useContext } from "react";
import { PostContext } from "../context/PostContext";
import { AuthContext } from "../context/AuthContext";

const CreatePost = () => {
  const { createPost } = useContext(PostContext);
  const { user } = useContext(AuthContext);
  const [content, setContent] = useState("");

  const handleCreatePost = (e) => {
    e.preventDefault();
    if (!user) {
      alert("You must be logged in to create a post.");
      return;
    }
    createPost(content, user.name);
    setContent("");
  };

  return (
    <div>
      <h2>Create Post</h2>
      <form onSubmit={handleCreatePost}>
        <textarea
          placeholder="What's on your mind?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
        <button type="submit">Post</button>
      </form>
    </div>
  );
};

export default CreatePost;
