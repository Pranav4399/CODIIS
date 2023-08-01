import { useState } from "react";
import "./faculty.scss";
import { CreateAssignment } from "./createAssignment";
import { ViewAssignment } from "./viewAssignment";
import { Button } from "@mui/material";

const FacultyHome = () => {
 const [showCreate, setShowCreate] = useState(false);
 const [showView, setShowView] = useState(false);
  return (
    <div className="faculty-container">
      <div className="showButton"><Button variant="contained" onClick={() => setShowCreate(true)}>Create Assignment</Button></div>
      <div className="showButton"><Button variant="contained" onClick={() => setShowView(true)}>View Assignment</Button></div>
      {showCreate && <CreateAssignment />}
      {showView && <ViewAssignment />}
    </div>
  );
};

export default FacultyHome;
