import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { Button, TextField, RadioGroup, FormControlLabel, Radio } from "@mui/material";
import "./Styles.scss"; // Import the SCSS file

function SignUp() {
  const history = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");

  async function submit(e) {
    e.preventDefault();

    try {
      await axios
        .post("http://localhost:8000/signup", {
          email,
          password,
          role
        })
        .then((res) => {
          if (res.data == "exist") {
            alert("User already exists");
          } else if (res.data == "notexist") {
            history("/home", { state: { id: email, role: role } });
          }
        })
        .catch((e) => {
          alert("wrong details");
          console.log(e);
        });
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <div className="signup-container">
      <h1 className="signup-title">Signup</h1>

      <form action="POST">
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
        <RadioGroup
          aria-labelledby="demo-controlled-radio-buttons-group"
          name="controlled-radio-buttons-group"
          onChange={(e) => setRole(e.target.value)}
          value={role}
          row
        >
          <FormControlLabel value="student" control={<Radio />} label="Student" />
          <FormControlLabel value="faculty" control={<Radio />} label="Faculty" />
        </RadioGroup>
        <Button variant="contained" type="submit" onClick={submit}>Submit</Button>
      </form>

      <br />
      <p>OR</p>
      <br />

      <Link to="/">Login Page</Link>
    </div>
  );
}

export default SignUp;
