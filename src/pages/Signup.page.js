import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import {
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  Button,
} from "@mui/material";

function SignUp() {
  const history = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const validateEmail = () => {
    if (!email) {
      setEmailError("Email is required");
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Invalid email address");
    } else {
      setEmailError("");
    }
  };

  const validatePassword = () => {
    if (!password) {
      setPasswordError("Password is required");
    } else if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
    } else {
      setPasswordError("");
    }
  };

  const submit = async (e) => {
    e.preventDefault();

    validateEmail();
    validatePassword();

    if (!emailError && !passwordError) {
      try {
        const res = await axios.post("http://localhost:8000/signup", {
          email,
          password,
          role,
        });

        if (res.data === "exist") {
          alert("User already exists");
        } else if (res.data === "notexist") {
          history("/home", { state: { id: email, role: role } });
        }
      } catch (error) {
        alert("Error: " + error.message);
        console.error(error);
      }
    }
  };

  return (
    <div className="signup-container">
      <h1 className="signup-title">Signup</h1>

      <form action="POST">
        <TextField
          type="email"
          onChange={(e) => {
            setEmail(e.target.value);
            setEmailError("");
          }}
          onBlur={validateEmail}
          error={Boolean(emailError)}
          helperText={emailError}
          placeholder="Email"
        />
        <TextField
          type="password"
          onChange={(e) => {
            setPassword(e.target.value);
            setPasswordError("");
          }}
          onBlur={validatePassword}
          error={Boolean(passwordError)}
          helperText={passwordError}
          placeholder="Password"
        />
        <RadioGroup
          aria-labelledby="demo-controlled-radio-buttons-group"
          name="controlled-radio-buttons-group"
          onChange={(e) => setRole(e.target.value)}
          value={role}
          row
        >
          <FormControlLabel
            value="student"
            control={<Radio />}
            label="Student"
          />
          <FormControlLabel
            value="faculty"
            control={<Radio />}
            label="Faculty"
          />
        </RadioGroup>
        <Button variant="contained" type="submit" onClick={submit}>
          Submit
        </Button>
      </form>

      <br />
      <p>OR</p>
      <br />

      <Link to="/">Login Page</Link>
    </div>
  );
}

export default SignUp;
