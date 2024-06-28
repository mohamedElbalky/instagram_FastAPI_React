import { useState, useEffect } from "react";

import { Button, hexToRgb, Modal } from "@mui/material";

import Post from "./components/Post";

const BASE_URL = "http://localhost:8000/";

function App() {
  // data
  const [posts, setPosts] = useState([]);

  // modals
  const [openSignIn, setOpenSignIn] = useState(false);
  const [openSignUp, setOpenSignUp] = useState(false);

  // authentication forms
  const [signinForm, setSigninForm] = useState({ username: "", password: "" });
  const [signupForm, setSignupForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  // token data
  const [authToken, setAuthToken] = useState(null);
  const [authTokenType, setAuthTokenType] = useState(null);
  const [authUserId, setAuthUserId] = useState("");
  const [authUsername, setAuthUsername] = useState("");

  // get data from local storage if page is refresh
  useEffect(() => {
    const storedToken = window.localStorage.getItem("authToken");
    const storedTokenType = window.localStorage.getItem("authTokenType");
    const storedUserId = window.localStorage.getItem("authUserId");
    const storedUsername = window.localStorage.getItem("authUsername");

    if (storedToken && storedTokenType && storedUserId && storedUsername) {
      setAuthToken(storedToken);
      setAuthTokenType(storedTokenType);
      setAuthUserId(storedUserId);
      setAuthUsername(storedUsername);
    }
  }, []);

  // store longin data in local storage
  useEffect(() => {
    authToken
      ? window.localStorage.setItem("authToken", authToken)
      : window.localStorage.removeItem("authToken");
    authTokenType
      ? window.localStorage.setItem("authTokenType", authTokenType)
      : window.localStorage.removeItem("authTokenType");
    authUserId
      ? window.localStorage.setItem("authUserId", authUserId)
      : window.localStorage.removeItem("authUserId");
    authUsername
      ? window.localStorage.setItem("authUsername", authUsername)
      : window.localStorage.removeItem("authUsername");
  }, [authToken, authTokenType, authUserId, authUsername]);

  // fetch data from API
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
    return <Post post={post} key={post.id} authUserId={authUserId} authToken={authToken} />;
  });

  function handleSignin(e) {
    e?.preventDefault();

    if (signinForm.username != "" && signinForm.password != "") {
      let formData = new FormData();
      formData.append("username", signinForm.username);
      formData.append("password", signinForm.password);

      const requestOptions = {
        method: "POST",
        body: formData,
      };

      fetch(BASE_URL + "login", requestOptions)
        .then((response) => {
          if (response.ok) {
            return response.json();
          }
          throw response;
        })
        .then((data) => {
          setAuthToken(data.access_token);
          setAuthTokenType(data.token_type);
          setAuthUserId(data.user_id);
          setAuthUsername(data.username);

          // clear form fields
          setSigninForm({ username: "", password: "" });
        })
        .catch((err) => {
          console.error(err);
          // TODO: handle failed login
          alert("Error");
        });

      setOpenSignIn(false);
    } else {
      // TODO: handle failed login
      console.log("invalid data from SignIn");
    }
  }

  // loging automatically after signup
  function loginAfterSignUp() {
    let formData = new FormData();
    formData.append("username", signupForm.username);
    formData.append("password", signupForm.password);

    const requestOptions = {
      method: "POST",
      body: formData,
    };

    fetch(BASE_URL + "login", requestOptions)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw response;
      })
      .then((data) => {
        setAuthToken(data.access_token);
        setAuthTokenType(data.token_type);
        setAuthUserId(data.user_id);
        setAuthUsername(data.username);

        // clear form fields
        setSigninForm({ username: "", password: "" });
      })
      .catch((err) => {
        console.error(err);
        // TODO: handle failed login
        alert("Error");
      });
  }


  function handleSignup(e) {
    e?.preventDefault();

    if (
      signupForm.username != "" &&
      signupForm.password != "" &&
      signupForm.email != ""
    ) {
      const json_strings = JSON.stringify(signupForm);
      let requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: json_strings,
      };

      fetch(BASE_URL + "users/", requestOptions)
        .then((response) => {
          if (response.ok) {
            return response.json();
          }
          throw response;
        })
        .then((data) => {
          // console.log(data);

          // login by new user
          loginAfterSignUp()

          // clean form
          setSignupForm({ username: "", email: "", password: "" });
        })
        .catch((err) => {
          console.error(err);
          // TODO: handle failed signup
          alert("Error");
        });

      // close modal
      setOpenSignUp(false);
    } else {
      // TODO: handle failed signup
      console.log("invalid data from signUp");
    }
  }

  function handleLogOut() {
    setAuthToken(null);
    setAuthTokenType(null);
    setAuthUserId("");
    setAuthUsername("");
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
          <form
            method="post"
            action=""
            className="app_signin"
            onSubmit={handleSignin}
          >
            <center>
              <img src="logo.png" alt="logo" className="app_signin_image" />
            </center>
            <input
              required
              type="text"
              placeholder="username"
              value={signinForm.username}
              onChange={(e) =>
                setSigninForm({ ...signinForm, username: e.target.value })
              }
            />
            <input
              required
              type="password"
              placeholder="password"
              value={signinForm.password}
              onChange={(e) =>
                setSigninForm({ ...signinForm, password: e.target.value })
              }
            />

            <Button type="submit" className="signin_btn">
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
          <form
            method="post"
            action=""
            className="app_signin"
            onSubmit={handleSignup}
          >
            <center>
              <img src="logo.png" alt="logo" className="app_signin_image" />
            </center>
            <input
              required
              type="text"
              placeholder="username"
              value={signupForm.username}
              onChange={(e) =>
                setSignupForm({ ...signupForm, username: e.target.value })
              }
            />
            <input
              required
              type="email"
              placeholder="email"
              value={signupForm.email}
              onChange={(e) =>
                setSignupForm({ ...signupForm, email: e.target.value })
              }
            />
            <input
              required
              type="password"
              placeholder="password"
              value={signupForm.password}
              onChange={(e) =>
                setSignupForm({ ...signupForm, password: e.target.value })
              }
            />

            <Button type="submit" className="signin_btn">
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

        {authToken ? (
          <>
            <div className="user_info">
              <p>{authUsername}</p>
            </div>
            <Button onClick={() => handleLogOut()}>Logout</Button>
          </>
        ) : (
          <div className="auth_btns">
            <Button onClick={() => setOpenSignIn(true)}>Login</Button>
            <Button onClick={() => setOpenSignUp(true)}>Signup</Button>
          </div>
        )}
      </div>
      {/* end header section */}

      <div className="app_posts">{postsList}</div>
    </div>
  );
}

export default App;
