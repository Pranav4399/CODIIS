import React, { useState } from "react";
import AuthService from "../Backend/AuthService";
import "./Login.scss";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const userData = { username, password };
      const response = await AuthService.login(userData);
      console.log(response); // You can handle the response here, e.g., redirect the user after successful login.
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div>
      <h2 className="login-header">Login</h2>
      <form onSubmit={handleLogin} className="login-form">
        <label>
          Username : 
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </label>
        <label>
          Password : 
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
