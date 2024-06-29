import { useState } from "react";
import { Button, Modal } from "@mui/material";

const BASE_URL = "http://localhost:8000/";

export default function ImageUpload({
  authToken,
  authTokenType,
}) {
  const [open, setOpen] = useState(false);

  const [postForm, setPostForm] = useState({ caption: "", image: null });

  function handleUplaodingImage(e) {
    console.log(e.target.files);
    if (e.target.files[0]) {
      setPostForm({ ...postForm, image: e.target.files[0] });
    }
  }

  function handleUplaod(e) {
    e?.preventDefault();

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
        // console.log(data);

        //
        addNewPost(data.filename);

        setOpen(false);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {});
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
        console.error(error);
      })
      .finally(() => {
        setPostForm({ caption: "", image: null });
      });
  }

  return (
    <div>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <div className="modal_box">
          <form action="" className="app_signin">
            <input
              required
              type="text"
              placeholder="Enter a caption..."
              value={postForm.caption}
              onChange={(e) =>
                setPostForm({ ...postForm, caption: e.target.value })
              }
            />
            <input required type="file" onChange={handleUplaodingImage} />
            <Button
              variant="contained"
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

      {/* <Button onClick={() => setOpen(true)}>Upload Image</Button> */}
      <Button variant="outlined" size="small" onClick={() => setOpen(true)}>
        Add Post
      </Button>
    </div>
  );
}
