const express = require("express");
const { userCollection, assignmentCollection } = require("./mongo"); // Import the object containing both collections
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
      await collection.insertMany([data]);
    }
  } catch (e) {
    res.json("fail");
  }
});

// API to create a new assignment
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

// API to get all assignments
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

app.listen(8000, () => {
  console.log("port connected");
});
