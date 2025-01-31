import { useState, useContext } from "react";
import { PostContext } from "../context/PostContext";
import { AuthContext } from "../context/AuthContext";

const Posts = () => {
  const { posts, addComment } = useContext(PostContext);
  const { user } = useContext(AuthContext);
  const [comment, setComment] = useState("");

  const handleAddComment = (postId) => {
    if (!user) {
      alert("You must be logged in to comment.");
      return;
    }
    addComment(postId, comment, user.name);
    setComment("");
  };

  return (
    <div>
      <h2>Community Posts</h2>
      {posts.map((post) => (
        <div key={post.id} className="post-card">
          <p>{post.content}</p>
          <p><strong>Posted by:</strong> {post.createdBy}</p>
          <div>
            {post.comments.map((comment, index) => (
              <div key={index} className="comment">
                <p><strong>{comment.user}:</strong> {comment.comment}</p>
              </div>
            ))}
          </div>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add a comment..."
          />
          <button onClick={() => handleAddComment(post.id)}>Comment</button>
        </div>
      ))}
    </div>
  );
};

export default Posts;
