// src/App.js (Frontend entry point)
import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import {
  ListSubheader,
  List,
  ListItem,
  ListItemButton,
  Paper,
  Radio,
  RadioGroup,
  FormControlLabel,
  Button,
  Card,
  Divider,
} from "@mui/material";
import "../Student/student.scss";

const StudentAnswer = ({ id }) => {
  const [assignments, setAssignments] = useState([]);
  const [student, setStudent] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState();
  const [answers, setAnswers] = useState();
  const [score, setScore] = useState();

  async function fetchAllAssignments() {
    try {
      const res = await axios.get("http://localhost:8000/assignments", {
        id,
      });
      if (res.data.status === 200) {
        console.log(res.data.result, "1");
        setAssignments(res.data.result);
      }
    } catch (error) {
      console.error("Error fetching assignments:", error);
    }
  }

  async function fetchStudentAssignments() {
    try {
      const res = await axios.get("http://localhost:8000/studentAssignments");
      if (res.data.status === 200) {
        console.log(res.data.result, "2");
        setStudent(res.data.result);
      }
    } catch (error) {
      console.error("Error fetching assignments:", error);
    }
  }

  useEffect(() => {
    fetchAllAssignments();
    fetchStudentAssignments();
  }, []);

  const handleStudentClick = (student) => {
    setSelectedStudent(student);
    setAnswers([]);
    setScore([]);
  };


  const handleSubmit = async () => {
    try {
      axios
        .put(`http://localhost:8000/updateScore`, {
          studentScore: score.reduce((total, item) => total + item.score, 0),
          studentId: selectedStudent.studentId,
          assignmentId: score[0]?.assignmentId
        })
        .then((response) => {
          setSelectedStudent();
          alert("Assignment of Student has been corrected and data stored Successfully");
        })
        .catch((error) => {
          alert("Error submitting changes");
        });
    } catch (error) {
      console.error("Error submitting answers:", error);
    }
  };

  const handleChange = (aid, qid, option) => {
    if (score.find(i => i.questionId === qid)) {
      const updatedScore = score.map(item => {
        if (item.questionId === qid) {
          return {
            ...item,
            score: Number(option)
          };
        }
        return item;
      });
  
      setScore(updatedScore);
    } else {
      setScore([...score, {
        assignmentId: aid,
        questionId: qid,
        score: Number(option)
      }]);
    }
  };
  
  return (
    <div className="student-view">
      <div className="assignment-list">
        <List
          component={Paper}
          sx={{ width: "100%", maxWidth: 360 }}
          subheader={<ListSubheader>Students</ListSubheader>}
        >
          {student.map((s) => {
            return (
              <ListItem disablePadding key={s.studentId}>
                <ListItemButton onClick={() => handleStudentClick(s)}>
                  {s.studentId}
                  {}
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </div>
      <div className="assignment-detail">
        <Card variant="outlined">
          {selectedStudent && (
            <div>
              <div className="header">
                {"Answers of " + selectedStudent.studentId}
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSubmit}
                >
                  Submit
                </Button>
              </div>
              <Divider />
              {selectedStudent.assignment.map((assgn, index) => {
                const sameAssignment = assignments.find(
                  (item) => item.assignmentId === assgn.assignmentId
                );
                if (sameAssignment) {
                  return assgn.answers.map((question, index) => {
                    const qs = sameAssignment.questions.find(
                      (q) => q.questionId === question.questionId
                    );

                    return (
                      <div key={question.questionId}>
                        <h4 className="question" style={{textDecoration: "underline"}}>{assgn.studentScore !== -1 ? "You have already corrected this assignment" : ""}</h4>
                        <p className="question">
                          {index + 1 + ". " + qs.question + " (Part of " + sameAssignment.assignmentName + ")"}
                        </p>
                        <RadioGroup
                          aria-label={`question-${qs.questionId}`}
                          name={`question-${qs.questionId}`}
                          row
                          className="options"
                        >
                          {qs.questionOptions
                            .split(",")
                            .map((option, optionIndex) => (
                              <FormControlLabel
                                key={optionIndex}
                                control={<Radio />}
                                label={option}
                                disabled
                                value={question.answer}
                              />
                            ))}
                        </RadioGroup>
                        <div className="correction-container">
                          <div>Student Answer is {question.answer}</div>
                          <RadioGroup
                            name="use-radio-group"
                            defaultValue="first"
                            row
                            onChange={(e) =>
                              handleChange(sameAssignment.assignmentId, question.questionId, e.target.value)
                            }
                          >
                            <FormControlLabel
                              value={1}
                              label="Correct"
                              control={<Radio />}
                              disabled={assgn.studentScore !== -1}
                            />
                            <FormControlLabel
                              value={0}
                              label="Incorrect"
                              control={<Radio />}
                              disabled={assgn.studentScore !== -1}
                            />
                          </RadioGroup>
                        </div>
                        <Divider />
                      </div>
                    );
                  });
                } else {
                  return (
                    <div>Student has not attempted your assignment yet</div>
                  );
                }
              })}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default StudentAnswer;
