import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "./Styles.scss"; // Import the SCSS file
import { Button, TextField } from "@mui/material";
import Cookies from "universal-cookie";

function Login() {
  const history = useNavigate();
  const cookies = new Cookies();


  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function submit(e) {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:8000/login", {
        email,
        password,
      });

      if (res.data.status === "exist") {
        cookies.set("TOKEN", res.data.token, {
          path: "/",
        });
        history("/home", { state: { id: email, role: res.data.role, token: res.data.token } });
      } else if (res.data.status === "notexist") {
        alert("User has not signed up");
      }
    } catch (error) {
      alert("Wrong details");
      console.error(error);
    }
  }

  return (
    <div className="login-container">
      <h1 className="login-title">Login</h1>

      <form action="POST" onSubmit={submit}>
        <TextField 
          type="email"
          onChange={(e) => {
            setEmail(e.target.value);
          }}
          placeholder="Email"
        />
        <TextField 
          type="password"
          onChange={(e) => {
            setPassword(e.target.value);
          }}
          placeholder="Password"
        />
        <Button variant="contained" type="submit">Submit</Button>
      </form>

      <br />
      <p>OR</p>
      <br />

      <Link to="/signup">Signup Page</Link>
    </div>
  );
}

export default Login;
