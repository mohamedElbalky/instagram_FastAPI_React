import PropTypes from "prop-types";
import { useState, useEffect } from "react";

import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { Avatar, Button } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";



const BASE_URL = "http://localhost:8000/";

export default function Post({ post, authUserId, authToken, onDelete }) {
  const [imgUrl, setImgUrl] = useState("");
  const [comments, setComments] = useState([]);

  const [commentInput, setCommentInput] = useState("");

  useEffect(() => {
    if (post.image_url_type === "absolute") {
      setImgUrl(post.image_url);
    } else {
      setImgUrl(BASE_URL + post.image_url);
    }
  }, [post]);

  useEffect(() => {
    setComments(post.comments);
  }, [post]);

  const commentsList = comments.map((comment) => {
    return (
      <p key={comment.id}>
        <strong>{comment.user.username}:</strong> {comment.text}
      </p>
    );
  });

  const handleAddComment = (e) => {
    e.preventDefault();
    if (commentInput.trim() !== "") {
      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          text: commentInput,
          post_id: post.id,
        }),
      };

      fetch(BASE_URL + `post/comment`, requestOptions)
        .then((response) => {
          if (response.ok) {
            return response.json();
          }
          throw response;
        })
        .then((data) => {
          console.log(data);
          setComments([...comments, data]);
          setCommentInput("");
        })
        .catch((error) => console.error("Error:", error));
    } else {
      alert("Please enter a comment");
    }
  };

  // Helper function to format the timestamp
  // const formatTimestamp = (timestamp) => {
  //   const date = new Date(timestamp);
  //   const dateString = date.toLocaleDateString("en-US", {
  //     year: "numeric",
  //     month: "long",
  //     day: "numeric",
  //   });
  //   const timeString = date.toLocaleTimeString("en-US", {
  //     hour: "2-digit",
  //     minute: "2-digit",
  //     second: "2-digit",
  //   });
  //   return `${dateString} ${timeString}`;
  // };

  function handleDeletePost() {
    onDelete(post.id);
  }

  return (
    <div className="post">
      <div className="post_header">
        <Avatar alt="Catalin" src="" />
        <div className="post_headerinfo">
          <h3>{post.user.username}</h3>
          {post.user.id == authUserId ? (
            <DeleteForeverIcon
              className="post_delete_btn"
              onClick={handleDeletePost}
              variant="outlined"
              color="error"
            >
              Delete
            </DeleteForeverIcon>
          ) : (
            ""
          )}
        </div>
      </div>
      <img className="post_image" src={imgUrl} alt="" />
      <small className="created_time">Created at: {post.timestamp}</small>
      <h4 className="post_caption">{post.caption}</h4>
      {comments.length > 0 ? (
        <div className="post_comments">{commentsList}</div>
      ) : (
        <div className="post_comments" style={{ color: "#777" }}>
          <p>No comments yet...</p>
        </div>
      )}
      {authToken ? (
        <div className="post_comments">
          <form action="" className="comment_form" onSubmit={handleAddComment}>
            <input
              type="text"
              placeholder="add comment..."
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
            />
            <SendIcon
              type="submit"
              variant="outlined"
              size="small"
              color="success"
              className="add_comment_btn"
              onClick={handleAddComment}
            >
              post
            </SendIcon>
          </form>
        </div>
      ) : (
        ""
      )}


    </div>
  );
}

// ------------------------------------
Post.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.number.isRequired,
    caption: PropTypes.string.isRequired,
    image_url: PropTypes.string.isRequired,
    image_url_type: PropTypes.string.isRequired,
    timestamp: PropTypes.string.isRequired,
    comments: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        text: PropTypes.string.isRequired,
        user: PropTypes.shape({
          username: PropTypes.string.isRequired,
        }).isRequired,
      })
    ).isRequired,
    user: PropTypes.shape({
      username: PropTypes.string.isRequired,
      id: PropTypes.number.isRequired,
    }).isRequired,
  }).isRequired,
  authUserId: PropTypes.number,
  authToken: PropTypes.string,
  onDelete: PropTypes.func,
};
