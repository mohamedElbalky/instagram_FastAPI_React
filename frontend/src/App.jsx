import { useState, useEffect } from "react";

import { Button, Modal } from "@mui/material";

import Post from "./components/Post";

const BASE_URL = "http://localhost:8000/";

function App() {
  const [posts, setPosts] = useState([]);

  const [openSignIn, setOpenSignIn] = useState(false);
  const [openSignUp, setOpenSignUp] = useState(false);

  const [signinForm, setSigninForm] = useState({ username: "", password: "" });
  const [signupForm, setSignsignupForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    fetch(BASE_URL + "post")
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw response;
      })
      .then((data) => {
        // sort data decinding according to timestamp
        const sortedData = data.sort(
          (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
        );
        return sortedData;
      })
      .then((data) => {
        // console.log(data);
        setPosts(data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  const postsList = posts.map((post) => {
    return <Post post={post} key={post.id} />;
  });

  function handleSignin() {
    console.log("Sign In");
  }

  function handleSignup() {
    console.log("Sign Up");
  }

  return (
    <div className="app">
      {/* start modal section */}
      {/* Sign In Modal form */}
      <Modal
        open={openSignIn}
        onClose={() => setOpenSignIn(false)}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <div className="modal_box">
          <form method="post" action="" className="app_signin">
            <center>
              <img src="logo.png" alt="logo" className="app_signin_image" />
            </center>
            <input
              type="text"
              placeholder="username"
              value={signinForm.username}
              onChange={(e) =>
                setSigninForm({ ...signinForm, username: e.target.value })
              }
            />
            <input
              type="password"
              placeholder="password"
              value={signinForm.password}
              onChange={(e) =>
                setSigninForm({ ...signinForm, password: e.target.value })
              }
            />

            <Button type="submit" className="signin_btn" onClick={handleSignin}>
              SignIn
            </Button>
          </form>
        </div>
      </Modal>
      {/* Sign Up Modal form */}
      <Modal
        open={openSignUp}
        onClose={() => setOpenSignUp(false)}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <div className="modal_box">
          <form method="post" action="" className="app_signin">
            <center>
              <img src="logo.png" alt="logo" className="app_signin_image" />
            </center>
            <input
              type="text"
              placeholder="username"
              value={signupForm.username}
              onChange={(e) =>
                setSignsignupForm({ ...signupForm, username: e.target.value })
              }
            />
            <input
              type="email"
              placeholder="email"
              value={signupForm.email}
              onChange={(e) =>
                setSignsignupForm({ ...signupForm, email: e.target.value })
              }
            />
            <input
              type="password"
              placeholder="password"
              value={signupForm.password}
              onChange={(e) =>
                setSignsignupForm({ ...signupForm, password: e.target.value })
              }
            />

            <Button type="submit" className="signin_btn" onClick={handleSignup}>
              SignUp
            </Button>
          </form>
        </div>
      </Modal>
      {/* end modal section */}

      {/* start header section */}
      <div className="app_header">
        <div className="app_header_image">
          <img src="logo.png" alt="Instegram" />
        </div>
        <div className="auth_btns">
          <Button onClick={() => setOpenSignIn(true)}>Login</Button>
          <Button onClick={() => setOpenSignUp(true)}>Signup</Button>
        </div>
      </div>
      {/* end header section */}
      
      <div className="app_posts">{postsList}</div>
    </div>
  );
}

export default App;
