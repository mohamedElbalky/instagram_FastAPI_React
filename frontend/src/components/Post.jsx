import PropTypes from "prop-types";
import { useState, useEffect } from "react";

import { Avatar, Button } from "@mui/material";

const BASE_URL = "http://localhost:8000/";

export default function Post({ post, authUserId, authToken }) {
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

  function handleDeletePost(post_id) {
    const requestOptions = {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    };
    fetch(BASE_URL + `post/${post_id}/delete`, requestOptions)
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw response;
      })
      .then(response => {
        console.log(response)
      })
      .catch(error => {
        console.error(error);
      });
  }

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
          {post.user.id == authUserId ? (
            <Button className="post_delete_btn" onClick={() => handleDeletePost(post.id)} variant="outlined" color="error">Delete</Button>
          ) : (
            ""
          )}
        </div>
      </div>
      <img className="post_image" src={imgUrl} alt="" />
      <small className="created_time">
        Created at: {() => formatTimestamp(post.timestamp)}
      </small>
      <h4 className="post_caption">{post.caption}</h4>
      {comments.length > 0 ? (
        <div className="post_comments">{commentsList}</div>
      ) : (
        <div className="post_comments">
          <p style={{ color: "#777" }}>No comments yet...</p>
        </div>
      )}
    </div>
  );
}

// ------------------------------------
Post.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.string.isRequired,
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
      id: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};
