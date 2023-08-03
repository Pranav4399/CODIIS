import { useState, useEffect } from "react";
import axios from "axios";
import { Chip } from "@mui/material";

export const ViewAssignment = ({ id }) => {
  const [assignments, setAssignments] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await axios.get("http://localhost:8000/assignments", {
          id,
        });

        if (res.data.status === 200) {
          console.log(res.data.result);
          setAssignments(res.data.result);
        } else if (res.data.status === 404) {
          alert("Error occured");
        }
      } catch (error) {
        alert("Wrong details");
        console.error(error);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="view-container">
      {assignments.map((item, index) => {
        return (
          <div className="assignment-container" key={index}>
            <h2>{item.assignmentName}</h2>
            {item.questions.map((q, i) => {
              return <div className="question-container">
                <div className="question">{q.question}</div>
                <div className="options">
                  {q.questionOptions.split(',').map((option) => {
                    return (
                      <div className="option">
                        <Chip label={option} />
                      </div>
                    );
                  })}
                </div>
                <div className="answer"><Chip label={q.answer} color="success" /></div>
              </div>;
            })}
          </div>
        );
      })}
    </div>
  );
};
