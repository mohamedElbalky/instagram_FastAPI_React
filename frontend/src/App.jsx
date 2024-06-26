import { useState, useEffect } from "react";

import {Button} from '@mui/material';

import Post from "./components/Post";

const BASE_URL = "http://localhost:8000/";

function App() {
  const [posts, setPosts] = useState([]);
  const [openSignIn, setOpenSignIn] = useState(false)
  const [openSignUp, setOpenSignUp] = useState(false)

  useEffect(() => {
    fetch(BASE_URL + "post")
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw response;
      })
      .then((data) => {
        const sortedData = data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        return sortedData
        // sort data according to timestamp
        // const result = data.sort((a, b) => {
        //   const t_a = a.timestamp.split(/[-T:]/);
        //   const t_b = b.timestamp.split(/[-T:]/);

        //   const d_a = new Date(
        //     Date.UTC(t_a[0], t_a[1] - 1, t_a[2], t_a[3], t_a[4], t_a[5])
        //   );
        //   const d_b = new Date(
        //     Date.UTC(t_b[0], t_b[1] - 1, t_b[2], t_b[3], t_b[4], t_b[5])
        //   );
        //   return d_b - d_a;
          

        // });
        // return result;
      })

      .then((data) => {
        console.log(data);
        setPosts(data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  const postsList = posts.map((post) => {
    return <Post post={post} key={post.id} />;
  });

  return (
    <div className="app">
      <div className="app_header">
        <div className="app_header_image">
          <img src="logo.png" alt="Instegram" />
        </div>
        <div className="auth_btns">
          <Button onClick={() => setOpenSignIn(true)}>Login</Button>
          <Button onClick={() => setOpenSignUp(true)}>Signup</Button>
        </div>
      </div>
      <div className="app_posts">{postsList}</div>
    </div>
  );
}

export default App;
