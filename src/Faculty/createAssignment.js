import { Button } from "@mui/material";
import TextField from "@mui/material/TextField";
import { useState } from "react";
import { JsonView } from "react-json-view-lite";
import { generateRandomString } from "../Helpers/helper.js";
import axios from "axios";
import "./faculty.scss";

export const CreateAssignment = ({id, setShowCreate}) => {
  const [details, setDetails] = useState({
    assignmentId: generateRandomString(),
    assignmentName: "",
    assignmentScore: 0,
    questions: [],
  });

  const handleAddQuestion = () => {
    setDetails((prev) => ({
      ...prev,
      questions: [
        ...prev.questions,
        {
          questionId: generateRandomString(),
          question: "",
          questionOptions: "",
          answer: "",
        },
      ],
    }));
  };

  const handleChange = (index, key, value) => {
    setDetails((prev) => {
      const updatedQuestions = [...prev.questions];
      updatedQuestions[index][key] = value;
      return { ...prev, questions: updatedQuestions };
    });
  };

  const handleNameChange = (e) => {
    setDetails((prev) => ({
      ...prev,
      assignmentName: e.target.value,
    }));
  };

  const handleDeleteQuestion = (index) => {
    setDetails((prev) => {
      const updatedQuestions = [...prev.questions];
      updatedQuestions.splice(index, 1);
      return { ...prev, questions: updatedQuestions };
    });
  };

  const handleScoreChange = (e) => {
    setDetails((prev) => ({
      ...prev,
      assignmentScore: e.target.value,
    }));
  }

  const handleSave = async() => {
    const areAllAttributesFilled = details.questions.every(
      (q) => q.question && q.questionOptions && q.answer && q.questionOptions.split(',').length === 4
    );

    if(!details.assignmentName){
      alert("Assignment name is a required field");
      return;
    }

    if(!details.questions.length) {
      alert("Atleast add one question in assignment");
      return;
    }

    if (!areAllAttributesFilled) {
      alert('Please fill all the fields for each question before saving. If all fields are filled, please check question options as 4 comma separated options needs to be providedz');
      return;
    }

    console.log('Saving data:', details);
    const {assignmentId, assignmentName, questions, assignmentScore} = details;

    try {
      const res = await axios.post("http://localhost:8000/assignments", {
        id,
        assignmentId,
        assignmentName,
        assignmentScore,
        questions
      });

      if (res.data.status === 200) {
        setShowCreate(false);
        alert("Assignment Created Successfully");
      } else if (res.data === "fail") {
        alert("Error occured");
      }
    } catch (error) {
      alert("Wrong details");
      console.error(error);
    }
  }

  return (
    <div className="create-container">
      <div className="assgn-name-container">
        <TextField
          id="outlined-basic"
          label="Assignment Name"
          variant="outlined"
          className="q-textbox"
          onChange={handleNameChange}
          required
        />
        <TextField label="Assignment Score" type="number" onChange={handleScoreChange} />
      </div>
      <Button className="add-btn" variant="contained" onClick={handleAddQuestion}>
          Add Questions
        </Button>
      {details.questions.map((q, index) => (
        <div className="question-container" key={index}>
          <TextField
            id="outlined-textarea"
            label="Question"
            placeholder="Enter question"
            value={q.question}
            onChange={(e) => handleChange(index, "question", e.target.value)}
            multiline
            className="q-textbox"
            required
          />
          <TextField
            id="outlined-textarea"
            label="Options"
            placeholder="Enter Options as comma separated values"
            multiline
            value={q.questionOptions}
            onChange={(e) =>
              handleChange(index, "questionOptions", e.target.value)
            }
            className="q-textbox"
            required
          />
          <TextField
            id="outlined-basic"
            label="Answer"
            variant="outlined"
            value={q.answer}
            onChange={(e) => handleChange(index, "answer", e.target.value)}
            className="q-textbox"
            required
          />
          <Button variant="contained" onClick={() => handleDeleteQuestion(index)} className="delete-btn">Delete</Button>
        </div>
      ))}
       <Button className="save-btn" variant="contained" onClick={handleSave}>
          Save
        </Button>
      {/* <JsonView data={details} /> */}
    </div>
  );
};
