const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const config = require("./config");
const authRoutes = require("./routes/auth");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

mongoose.connect(config.mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
})
.then(() => console.log("MongoDB connected"))
.catch((error) => console.error("MongoDB connection error:", error));

app.use("/api/auth", authRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
