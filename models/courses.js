const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A Course must have a name"],
  },
  totalClasses: {
    type: Number,
    default: 0,
  },
  students: {
    type: [
      {
        rollid: { type: String, required: true },
        name: { type: String, required: true },
        attended: { type: Number, default: 0 },
      },
    ],
    default: [],
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("Course", courseSchema);
