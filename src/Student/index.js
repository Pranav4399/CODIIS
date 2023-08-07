// src/App.js (Frontend entry point)
import React, { useEffect, useState } from "react";
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
import "./student.scss";

const StudentHome = ({ studentId }) => {
  const [assignments, setAssignments] = useState([]);
  const [studentAssignments, setStudentAssignments] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState();
  const [answers, setAnswers] = useState();

  async function fetchAllAssignments() {
    try {
      const res = await axios.get("http://localhost:8000/assignments");
      if (res.data.status === 200) {
        setAssignments(res.data.result);
      }
    } catch (error) {
      console.error("Error fetching assignments:", error);
    }
  }

  async function fetchStudentAssignments() {
    try {
      const res = await axios.get("http://localhost:8000/studentAssignments", {
        params: {
          studentId: studentId // Assuming studentId is defined in your frontend
        }
      });
      if (res.data.status === 200) {
        const studentAssignmentIds = res.data.result[0].assignment;
        setStudentAssignments(studentAssignmentIds);
      }
    } catch (error) {
      console.error("Error fetching assignments:", error);
    }
  }

  useEffect(() => {
    fetchAllAssignments();
    fetchStudentAssignments();
  }, []);

  const handleAssignmentClick = (assignment) => {
    setSelectedAssignment(assignment);
    setAnswers([]);
  };

  const handleOptionChange = (Id, option) => {
    const updatedAnswers = answers.map((item) =>
      item.questionId === Id ? { ...item, answer: option } : item
    );
  
    const alreadyPresent = updatedAnswers.some((item) => item.questionId === Id);
  
    setAnswers(alreadyPresent ? updatedAnswers : [...updatedAnswers, { questionId: Id, answer: option }]);
  };

  const isSubmitEnabled = () => {
    if (!selectedAssignment) {
      return false; // If no assignment is selected, disable the submit button
    }

    const answeredQuestionIds = answers.map(answer => answer.questionId);
    const allQuestionIds = selectedAssignment.questions.map(
      (question) => question.questionId
    );

    return allQuestionIds.every((questionId) =>
      answeredQuestionIds.includes(questionId)
    );
  };

  const handleSubmit = async () => {
    try {
      const req = {
        studentId: studentId,
        assignment: [
          {
            assignmentId: selectedAssignment.assignmentId,
            studentScore: -1,
            answers: answers,
          },
        ],
      };

      const res = await axios.post("http://localhost:8000/submit", req);

      if (res.data.status === 200) {
        fetchStudentAssignments();
        setSelectedAssignment();
        alert("Answers Submitted Successfully");
      } else if (res.data.status === 500) {
        alert("Error occured");
      }
    } catch (error) {
      console.error("Error submitting answers:", error);
    }
  };

  return (
    <div className="student-view">
      <div className="assignment-list">
        <List
          component={Paper}
          sx={{ width: "100%", maxWidth: 360 }}
          subheader={<ListSubheader>Pending Assignments</ListSubheader>}
        >
          {assignments.map((assignment) => {
            if(!studentAssignments.map((i) => i.assignmentId).includes(assignment.assignmentId))
            return <ListItem disablePadding key={assignment.assignmentId}>
              <ListItemButton onClick={() => handleAssignmentClick(assignment)}>
                {assignment.assignmentName}
              </ListItemButton>
            </ListItem>
}         )}
        </List>
        <List
          component={Paper}
          sx={{ width: "100%", maxWidth: 360 }}
          subheader={<ListSubheader>Completed Assignments</ListSubheader>}
        >
          {assignments.map((assignment) => {
            if(studentAssignments.map((i) => i.assignmentId).includes(assignment.assignmentId))
            return <ListItem disablePadding key={assignment.assignmentId}>
              <ListItemButton onClick={() => handleAssignmentClick(assignment)} disabled>
                {assignment.assignmentName}
              </ListItemButton>
              <span className="score">{studentAssignments[0].studentScore === -1 ? "Not corrected" : "Your score - " + studentAssignments[0].studentScore}</span>
            </ListItem>
}         )}
        </List>
      </div>
      <div className="assignment-detail">
        <Card variant="outlined">
          {selectedAssignment && (
            <div>
              <div className="header">
                {"Questions of " + selectedAssignment.assignmentName}
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSubmit}
                  disabled={!isSubmitEnabled()}
                >
                  Submit
                </Button>
              </div>
              <Divider />
              {selectedAssignment.questions.map((question, index) => (
                <div key={question.questionId}>
                  <p className="question">
                    {index + 1 + ". " + question.question}
                  </p>
                  <RadioGroup
                    aria-label={`question-${question.questionId}`}
                    name={`question-${question.questionId}`}
                    onChange={(e) =>
                      handleOptionChange(question.questionId, e.target.value)
                    }
                    row
                    className="options"
                  >
                    {question.questionOptions
                      .split(",")
                      .map((option, optionIndex) => (
                        <FormControlLabel
                          key={optionIndex}
                          value={option}
                          control={<Radio />}
                          label={option}
                        />
                      ))}
                  </RadioGroup>
                  <Divider />
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default StudentHome;
