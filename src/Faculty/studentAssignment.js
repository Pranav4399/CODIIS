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

  async function fetchAllAssignments() {
    try {
      const res = await axios.get("http://localhost:8000/assignments", {
        id,
      });
      if (res.data.status === 200) {
        console.log(res.data.result, "HELLO");
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
        console.log(res.data.result);
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
  };

  const isSubmitEnabled = () => {
    if (!selectedStudent) {
      return false; // If no assignment is selected, disable the submit button
    }

    const answeredQuestionIds = answers.map((answer) => answer.questionId);
    const allQuestionIds = selectedStudent.questions.map(
      (question) => question.questionId
    );

    return allQuestionIds.every((questionId) =>
      answeredQuestionIds.includes(questionId)
    );
  };

  const handleSubmit = async () => {
    try {
      const req = {
        assignment: [
          {
            assignmentId: selectedStudent.assignmentId,
            studentScore: -1,
            answers: answers,
          },
        ],
      };

      const res = await axios.post("http://localhost:8000/submit", req);

      if (res.data.status === 200) {
        fetchStudentAssignments();
        setSelectedStudent();
        alert("Answers Submitted Successfully");
      } else if (res.data.status === 500) {
        alert("Error occured");
      }
    } catch (error) {
      console.error("Error submitting answers:", error);
    }
  };

  const handleChange = (sid, qid, option) => {
    console.log(sid, qid, option);
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
                  //disabled={!isSubmitEnabled()}
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
                        <p className="question">
                          {index + 1 + ". " + qs.question}
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
                              handleChange(
                                selectedStudent.studentId,
                                question.questionId,
                                e.target.value
                              )
                            }
                          >
                            <FormControlLabel
                              value={1}
                              label="Correct"
                              control={<Radio />}
                            />
                            <FormControlLabel
                              value={0}
                              label="Incorrect"
                              control={<Radio />}
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
