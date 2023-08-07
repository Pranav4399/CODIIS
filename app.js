const express = require("express");
const { userCollection, assignmentCollection, answerCollection } = require("./mongo"); // Import the object containing both collections
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get("/", cors(), (req, res) => {});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userCollection.findOne({ email: email });

    if (user) {
      const passwordCheck = bcrypt.compareSync(password, user.password);
      if (!passwordCheck) {
        res.json({ status: "Passwords does not match 1" });
      } else {
        console.log("Inside else");
        const token = jwt.sign(
          {
            userId: user._id,
            userEmail: user.email,
          },
          "RANDOM-TOKEN",
          { expiresIn: "24h" }
        );

        res.json({
          status: "exist",
          role: user.role,
          token: token,
        });
      }
    } else {
      res.json({ status: "notexist" });
    }
  } catch (e) {
    res.json("fail");
  }
});

app.post("/signup", async (req, res) => {
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(req.body.password, salt);

  const data = {
    email: req.body.email,
    password: hash,
    role: req.body.role,
  };

  console.log(data, "Data");

  try {
    const check = await userCollection.findOne({ email: data.email });
    console.log(check, "check");
    if (check) {
      res.json("exist");
    } else {
      res.json("notexist");
      console.log(data);
      await userCollection.insertMany([data]);
    }
  } catch (e) {
    res.json("fail");
  }
});

app.post("/assignments", async (req, res) => {
  const { assignmentId, assignmentName, questions, id } = req.body;

  try {
    const newAssignment = {
      createdBy: id,
      assignmentId: assignmentId,
      assignmentName: assignmentName,
      questions: questions,
    };

    const result = await assignmentCollection.create(
      newAssignment
    );
    res.json({status: 200, result: result});
  } catch (e) {
    res.json("fail");
  }
});

app.get("/assignments", async (req, res) => {
  try {
    const createdBy = req.body.id;
    const assignments = await assignmentCollection.find(createdBy);

    if (assignments) {
      res.status(200).json({ status: 200, result: assignments });
    } else {
      res.status(404).json({ status: 404 });
    }
  } catch (e) {
    res.status(500).json({ status: 500, error: "Server Error" });
  }
});

app.get("/assignments", async (res) => {
  try {
    const assignments = await assignmentCollection.find();

    if (assignments) {
      res.status(200).json({ status: 200, result: assignments });
    } else {
      res.status(404).json({ status: 404 });
    }
  } catch (e) {
    res.status(500).json({ status: 500, error: "Server Error" });
  }
});

app.get("/studentAssignments", async (req, res) => {
  try {
    const studentId = req.query.studentId; // Accessing the studentId from query parameters
    const assignments = studentId ? await answerCollection.find({ studentId: studentId }) : await answerCollection.find();

    if (assignments) {
      res.status(200).json({ status: 200, result: assignments });
    } else {
      res.status(404).json({ status: 404 });
    }
  } catch (e) {
    res.status(500).json({ status: 500, error: "Server Error" });
  }
});


app.post('/submit', async (req, res) => {
  try {
    const { studentId, assignment } = req.body;
    console.log(assignment)
    const existingStudent = await answerCollection.findOne({ studentId: studentId });

    if (existingStudent) {
      // If the studentId exists, push the assignment object into the 'answers' array
      existingStudent.assignment.push(...assignment);
      await existingStudent.save();
    } else {
      // If the studentId doesn't exist, create a new student entry
      await answerCollection.create({ studentId: studentId, assignment: assignment });
    }

    res.json({ status: 200, message: 'Answers saved successfully' });
  } catch (e) {
    console.error('Error submitting answers:', e);
    res.status(500).json({ status: 500, error: 'Server Error' });
  }
});

app.put('/updateScore', async (req, res) => {
  const { studentId, assignmentId, studentScore } = req.body;
  console.log(assignmentId);

  try {
    // Find the answer document with the provided studentId and assignmentId
    const answer = await answerCollection.findOneAndUpdate(
      {
        studentId,
        'assignment.assignmentId': assignmentId
      },
      {
        $set: {
          'assignment.$.studentScore': studentScore
        }
      },
      { new: true } // Return the updated document
    );

    if (!answer) {
      return res.status(404).json({ error: 'Answer not found' });
    }

    res.json(answer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }

});


const PORT = 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
