import { useState } from "react";
import "./faculty.scss";
import { CreateAssignment } from "./createAssignment";
import { ViewAssignment } from "./viewAssignment";
import { Button } from "@mui/material";

const FacultyHome = ({id}) => {
 const [showCreate, setShowCreate] = useState(false);
 const [showView, setShowView] = useState(false);
  return (
    <div className="faculty-container">
      {!showView && <div className="showButton"><Button variant="contained" onClick={() => setShowCreate(prev => !prev)}>
        {!showCreate ? "Create Assignment" : "Back"}
      </Button></div>}
      {!showCreate && <div className="showButton"><Button variant="contained" onClick={() => setShowView(prev => !prev)}>
        {!showView ? "View Assignment" : "Back"}
      </Button></div>}
      {showCreate && <CreateAssignment id={id} setShowCreate={setShowCreate} />}
      {showView && <ViewAssignment id={id} setShowView={setShowView} />}
    </div>
  );
};

export default FacultyHome;
