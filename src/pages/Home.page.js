import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import StudentHome from "../Student";
import FacultyHome from "../Faculty";
import { Button } from "@mui/material";
import Cookies from "universal-cookie";
import "./home.scss";

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
      <div className="home-header">
        <div>Hello {location.state.id} and welcome to the home. Your role is {location.state.role}.</div>
        <Button variant="contained" onClick={handleLogout}>Logout</Button>
      </div>
      {location.state.role === "student" ? <StudentHome studentId={location.state.id} /> : <FacultyHome id={location.state.id} />}
    </div>
  );
}

export default Home;
