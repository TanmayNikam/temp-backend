const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const cors = require("cors");
const morgan = require("morgan");
const mongoose = require("mongoose");
require("dotenv").config();

const userRoutes = require("./routes/user");
const courseRoutes = require("./routes/courses");

mongoose
  .connect(process.env.DB_URL)
  .then(async () => {
    console.log("Database connected");
  })
  .catch((error) => console.log(error));

app.use(express.json());
app.use(cors());
app.use(morgan("tiny"));

app.use("/api/users", userRoutes);
app.use("/api/courses", courseRoutes);

app.listen(port, () => {
  console.log(`Started Listening on ${port}`);
});
