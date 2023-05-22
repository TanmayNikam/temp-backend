const fs = require("fs");
const path = require("path");
const { cloudinary } = require("../cloudinary");
const FormData = require("form-data");
const axios = require("axios");
const Course = require("../models/courses");

exports.addAttendance = async (req, res) => {
  try {
    const { record } = req.body;
    const courseid = req.body.courseid;
    console.log(courseid);

    fs.writeFileSync(
      `./sheets/${req.file.originalname}`,
      fs.readFileSync(req.file.path)
    );

    const data = new FormData();
    data.append(
      path.parse(req.file.originalname).name,
      fs.createReadStream(`./sheets/${req.file.originalname}`)
    );

    const response = await axios.post(
      `http://localhost:8000/nitin/v1/img?name=${
        path.parse(req.file.originalname).name
      }`,
      data
    );

    const responseData = response.data;
    const rows = Object.keys(responseData["0"]).length;
    let students = [],
      cols = Object.keys(responseData).length,
      classes = cols - 2;
    for (let i = 1; i < rows; i++) {
      let student = {
        name: responseData["1"][`${i}`].trim(),
        rollid: responseData["0"][`${i}`].trim(),
        attended: 0,
      };
      students.push(student);
    }

    for (let i = 2; i < cols; i++) {
      for (let j = 1; j < rows; j++)
        if (responseData[`${i}`][`${j}`] !== "") students[j - 1].attended += 1;
    }

    const course = await Course.findById(courseid.toString());
    course.totalClasses += classes;
    if (course.students.length === 0) course.students = students;
    else {
      students.forEach((student) => {
        let ind = course.students.indexOf((item) => item.name === student.name);
        course.students[ind].attended += student.attended;
      });
    }

    const updatedCourse = await Course.findByIdAndUpdate(
      courseid.toString(),
      {
        totalClasses: course.totalClasses,
        students: course.students,
      },
      { new: true }
    );
    console.log(updatedCourse);

    res.status(201).json({
      data: updatedCourse,
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.json({
      message: error.messsage,
      success: false,
    });
  }
};

