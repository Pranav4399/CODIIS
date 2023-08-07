const test = require('dotenv').config()
const mongoose = require("mongoose");

const dbURL = `mongodb+srv://${process.env.DB_USER}:Quf3N27iR5s9qKpX@atlascluster.qu7wk2l.mongodb.net/?retryWrites=true&w=majority`;
const connectionParams = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: "codiis-db",
};

mongoose
  .connect(dbURL, connectionParams)
  .then(() => {
    console.info("mongodb connected");
  })
  .catch(() => {
    console.info("failed");
  });

const newSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
});

const assignmentSchema = new mongoose.Schema({
  createdBy: {
    type: String,
    required: true
  },
  assignmentId: {
    type: String,
    required: true,
  },
  assignmentName: {
    type: String,
    required: true,
  },
  questions: [
    {
      questionId: { type: String, required: true },
      question: { type: String, required: true },
      questionOptions: { type: String, required: true},
      answer: { type: String, required: true },
    },
  ],
});

const answerSchema = new mongoose.Schema({
  studentId: {
    type: String,
    required: true
  },
  assignment: [
    {
      assignmentId: { type: String, required: true },
      studentScore: { type: Number, required: true },
      answers: [
        {
          questionId: { type: String, required: true },
          answer: { type: String, required: true },
        }
      ]
    }
  ],
});

const userCollection = mongoose.model("users", newSchema);
const assignmentCollection = mongoose.model("assignments", assignmentSchema);
const answerCollection = mongoose.model("answers", answerSchema)

module.exports = {
  userCollection: userCollection,
  assignmentCollection: assignmentCollection,
  answerCollection: answerCollection
};
