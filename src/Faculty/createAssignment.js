import { Button } from "@mui/material";
import TextField from "@mui/material/TextField";
import { useState } from "react";
import { JsonView } from "react-json-view-lite";

export const CreateAssignment = () => {
  const [details, setDetails] = useState({
    assignmentName: "",
    questions: [],
  });

  const handleAddQuestion = () => {
    setDetails((prev) => ({
      ...prev,
      questions: [
        ...prev.questions,
        {
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

  const handleSave = () => {
    // Check if all attributes in details are filled
    const areAllAttributesFilled = details.questions.every(
      (q) => q.question && q.questionOptions && q.answer
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
      alert('Please fill all the fields for each question before saving.');
      return;
    }

    // Here, you can proceed with the save logic
    console.log('Saving data:', details);
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
        </div>
      ))}
       <Button className="save-btn" variant="contained" onClick={handleSave}>
          Save
        </Button>
      <JsonView data={details} />
    </div>
  );
};
