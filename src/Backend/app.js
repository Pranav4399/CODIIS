const express = require("express");
const collection = require("./mongo");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get("/", cors(), (req, res) => {});

app.post("/", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await collection.findOne({ email: email });

    if (user) {
      console.log(password, user.password);
      const passwordCheck = bcrypt.compareSync(password, user.password);
      if (!passwordCheck) {
        console.log("inside if");
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
    const check = await collection.findOne({ email: data.email });
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

app.listen(8000, () => {
  console.log("port connected");
});
