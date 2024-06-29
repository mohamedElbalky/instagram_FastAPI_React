import { useState } from "react";
import { Button, Modal } from "@mui/material";
import Alert from '@mui/material/Alert';

const BASE_URL = "http://localhost:8000/";

export default function ImageUpload({ authToken, authTokenType }) {
  const [open, setOpen] = useState(false);

  const [postForm, setPostForm] = useState({ caption: "", image: null });
  const [errorAlert, setErrorAlert] = useState("")

  function handleUplaodingImage(e) {
    console.log(e.target.files);
    if (e.target.files[0]) {
      setPostForm({ ...postForm, image: e.target.files[0] });
    }
  }

  function handleUplaod(e) {
    e?.preventDefault();

    if (postForm.caption.trim() != "") {
      const formData = new FormData();
      formData.append("image", postForm.image);

      const requestOptions = {
        method: "POST",
        headers: {
          Authorization: `${authTokenType} ${authToken}`,
        },
        body: formData,
      };

      fetch(BASE_URL + "post/image", requestOptions)
        .then((response) => {
          if (response.ok) {
            return response.json();
          }
          throw response;
        })
        .then((data) => {
          addNewPost(data.filename);

          setOpen(false);
        })
        .catch((error) => {
          // TODO: handle error
          setErrorAlert("Please Choose an image");
        });
    } else {
      setErrorAlert("Please enter a caption");
    }
  }

  function addNewPost(image_filename) {
    const json_data = JSON.stringify({
      image_url: image_filename,
      caption: postForm.caption,
      image_url_type: "relative",
    });

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${authTokenType} ${authToken}`,
      },
      body: json_data,
    };

    fetch(BASE_URL + "post", requestOptions)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw response;
      })
      .then((data) => {
        window.location.reload();
        window.scrollTo(0, 0);
      })
      .catch((error) => {
        // TODO: handle error
        console.error(error);
      })
      .finally(() => {
        setPostForm({ caption: "", image: null });
      });
  }

  function closeModal() {
    setOpen(false)
    setPostForm({ caption: "", image: null });
    setErrorAlert("")
  }

  return (
    <div>
      <Modal
        open={open}
        onClose={() => closeModal()}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <div className="modal_box">
          {errorAlert ? <Alert variant="outlined" severity="error">{errorAlert}</Alert>: ""}
          <form action="" className="app_signin">
            <textarea
              rows="3"
              required
              type="text"
              placeholder="Enter a caption..."
              value={postForm.caption}
              onChange={(e) =>
                setPostForm({ ...postForm, caption: e.target.value })
              }
            ></textarea>
            <input required type="file" onChange={handleUplaodingImage} />
            <Button
              variant="outlined"
              color="success"
              size="small"
              className="signin_btn"
              onClick={handleUplaod}
            >
              Upload
            </Button>
          </form>
        </div>
      </Modal>

      <Button variant="outlined"  className="app_post_btn"  size="small" onClick={() => setOpen(true)}>
        Add Post
      </Button>
    </div>
  );
}
