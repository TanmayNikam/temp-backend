const Course = require("../models/courses");
const readXlsxFile = require("read-excel-file/node");

exports.addCourse = async (req, res) => {
  try {
    const { courseName } = req.body;
    const userid = req.user.id;
    const course = await Course.create({
      name: courseName,
      instructor: userid,
    });
    res.json({
      course,
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.json({ message: error.message, success: false });
  }
};

exports.deleteCourse = async (req, res) => {
  try {
    console.log(req.body);
    await Course.findByIdAndDelete(req.body.courseid);
    res.json({
      message: "Course Deleted",
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.json({
      messsage: error.message,
      success: false,
    });
  }
};

exports.addSheet = async (req, res) => {
  try {
    const course = await Course.findById(req.body.courseid.toString());
    let courseStudents = course.students;
    let totalClasses = course.totalClasses;
    let classes = 0;
    const rows = await readXlsxFile(req.file.path);
    classes = rows[0].length - 2;
    totalClasses += classes;
    for (let i = 1; i < rows.length; i++) {
      let rollid = rows[i][0].toString(),
        studentName = rows[i][1],
        attendance = rows[i].filter((item) => item !== null).length - 2;

      let student = courseStudents.find((item) => item.rollid === rollid);
      if (student) student.attended += attendance;
      else
        courseStudents.push({
          rollid,
          name: studentName,
          attended: attendance,
        });
    }
    const updatedCourse = await Course.findByIdAndUpdate(
      req.body.courseid.toString(),
      {
        totalClasses,
        students: courseStudents,
      },
      { new: true }
    );
    res.json({
      data: updatedCourse,
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.json({ message: error.message, success: false });
  }
};

exports.getCoursesByInstuctor = async (req, res) => {
  try {
    const courses = await Course.find({ instructor: req.user.id }).populate(
      "instructor"
    );
    res.json({
      data: courses,
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.json({
      message: error.message,
      success: false,
    });
  }
};
