import PropTypes from "prop-types";
import { useState, useEffect } from "react";

import { Avatar, Button } from "@mui/material";

const BASE_URL = "http://localhost:8000/";

export default function Post({ post }) {
  const [imgUrl, setImgUrl] = useState("");
  const [comments, setComments] = useState([]);

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

  // Helper function to format the timestamp
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const dateString = date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    const timeString = date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    return `${dateString} ${timeString}`;
  };

  return (
    <div className="post">
      <div className="post_header">
        <Avatar alt="Catalin" src="" />
        <div className="post_headerinfo">
          <h3>{post.user.username}</h3>
          <Button className="post_delete">Delete</Button>
        </div>
      </div>
      <img className="post_image" src={imgUrl} alt="" />
      <small className="created_time">
        Created at: {formatTimestamp(post.timestamp)}
      </small>
      <h4 className="post_caption">{post.caption}</h4>
      {comments.length > 0 ? (
        <div className="post_comments">{commentsList}</div>
      ) : (
        <div className="post_comments">
          <p style={{color: "#777"}}>No comments yet...</p>
        </div>
      )}
    </div>
  );
}

// ------------------------------------
Post.propTypes = {
  post: PropTypes.shape({
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
    }).isRequired,
  }).isRequired,
};
