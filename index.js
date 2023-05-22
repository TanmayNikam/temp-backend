const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const cors = require("cors");
const morgan = require("morgan");
const mongoose = require("mongoose");
require("dotenv").config();

const userRoutes = require("./routes/user");
const courseRoutes = require("./routes/courses");
const attendanceRoutes = require("./routes/attendance");

mongoose
  .connect(process.env.DB_URL)
  .then(async () => {
    console.log("Database connected");
  })
  .catch((error) => console.log(error));

app.use(express.json({ limit: "20mb" }));
app.use(cors());
app.use(morgan("tiny"));

app.use("/api/users", userRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/attendance", attendanceRoutes);

app.listen(port, () => {
  console.log(`Started Listening on ${port}`);
});
