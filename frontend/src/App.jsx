import { useState, useEffect, useRef } from "react";

import { Button, Modal } from "@mui/material";
import Alert from "@mui/material/Alert";

import Post from "./components/Post";
import Footer from "./components/Footer";

import ImageUpload from "./components/ImageUpload";

const BASE_URL = "http://localhost:8000/";

function App() {
  const inputRef = useRef(null);

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
  const [authUserId, setAuthUserId] = useState(null);
  const [authUsername, setAuthUsername] = useState(null);

  // ahndle errors
  const [errorAlert, setErrorAlert] = useState("");

  // validate email address
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  useEffect(() => {
    if (openSignIn == true && inputRef.current) {
      inputRef.current.focus();
    }
  }, [openSignIn]);

  // if (!openSignIn) {
  //   return null;
  // }



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
    return (
      <Post
        post={post}
        key={post.id}
        authUserId={authUserId}
        authToken={authToken}
        onDelete={onDelete}
      />
    );
  });

  function handleSignin(e) {
    e?.preventDefault();

    if (signinForm.username.trim() != "" && signinForm.password.trim() != "") {
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

          // reset alert
          setErrorAlert("");

          // close modal
          setOpenSignIn(false);
        })
        .catch((err) => {
          setErrorAlert("Invalid username or password, please try again");
        });
    } else {
      setErrorAlert("Please enter your username and password");
    }
  }

  // loging automatically after signup
  function loginAfterSignUp() {
    if (signupForm.username.trim() != "" && signupForm.password.trim() != "") {
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
          setErrorAlert("Error occurred, Please try again");
        });
    } else {
      setErrorAlert("Invalid data from SignUp");
    }
  }

  function handleSignup(e) {
    e?.preventDefault();

    if (
      signupForm.username.trim() != "" &&
      signupForm.password.trim() != "" &&
      signupForm.email.trim() != ""
    ) {
      if (!validateEmail(signupForm.email)) {
        setErrorAlert("Please enter a valid email address");
        return;
      }
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
          // login by new user
          loginAfterSignUp();

          // clean form
          setSignupForm({ username: "", email: "", password: "" });
          setSigninForm({ username: "", password: "" });

          // reset alert
          setErrorAlert("");

          // close modal
          setOpenSignUp(false);
        })
        .catch((err) => {
          setErrorAlert("Error occurred, please try again");
        });
    } else {
      setErrorAlert("Please fill all fields below");
    }
  }

  function handleLogOut() {
    setAuthToken(null);
    setAuthTokenType(null);
    setAuthUserId("");
    setAuthUsername("");
  }

  function onDelete(post_id) {
    const requestOptions = {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    };
    fetch(BASE_URL + `post/${post_id}/delete`, requestOptions)
      .then((response) => {
        if (response.ok) {
          return response.status;
        }
        throw response;
      })
      .then((response) => {
        // console.log(response)

        // update react-dom
        setPosts(posts.filter((post) => post.id !== post_id));
      })
      .catch((error) => {
        console.error(error);
      });
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
            {errorAlert ? (
              <Alert variant="outlined" severity="error">
                {errorAlert}
              </Alert>
            ) : (
              ""
            )}
            <input
              ref={inputRef}
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
          <form
            method="post"
            action=""
            className="app_signin"
            onSubmit={handleSignup}
          >
            <center>
              <img src="logo.png" alt="logo" className="app_signin_image" />
            </center>
            {errorAlert ? (
              <Alert variant="outlined" severity="error">
                {errorAlert}
              </Alert>
            ) : (
              ""
            )}
            <input
            ref={inputRef}
              type="text"
              placeholder="username"
              value={signupForm.username}
              onChange={(e) =>
                setSignupForm({ ...signupForm, username: e.target.value })
              }
            />
            <input
              type="email"
              placeholder="email"
              value={signupForm.email}
              onChange={(e) =>
                setSignupForm({ ...signupForm, email: e.target.value })
              }
            />
            <input
              type="password"
              placeholder="password"
              value={signupForm.password}
              onChange={(e) =>
                setSignupForm({ ...signupForm, password: e.target.value })
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

      {authToken ? (
        <div className="upload_box">
          <ImageUpload authToken={authToken} authTokenType={authTokenType} />
        </div>
      ) : (
        <div className="upload_box">
          <h3>You need to login to upload</h3>
        </div>
      )}
      <Footer />
    </div>
  );
}

export default App;
