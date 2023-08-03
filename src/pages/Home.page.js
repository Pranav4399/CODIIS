import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import StudentHome from "../Student";
import FacultyHome from "../Faculty";
import { Button } from "@mui/material";
import Cookies from "universal-cookie";

function Home() {
  const location = useLocation();
  const navigate = useNavigate();
  const cookies = new Cookies();

  const handleLogout = () => {
    cookies.remove("TOKEN", { path: "/" });
    navigate('/');
  }

  return (
    <div className="homepage">
      <h1>Hello {location.state.id} and welcome to the home. Your role is {location.state.role}.</h1>
      <Button variant="contained" onClick={handleLogout}>Logout</Button>
      {location.state.role === "student" ? <StudentHome id={location.state.id} /> : <FacultyHome id={location.state.id} />}
    </div>
  );
}

export default Home;
