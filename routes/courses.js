const { isAuthenticated } = require("../controllers/auth");
const {
  addCourse,
  addSheet,
  getCoursesByInstuctor,
  deleteCourse,
} = require("../controllers/courses");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./sheets/");
  },
  fileName: (req, res, cb) => {
    cb(null, file.originalName);
  },
});

const upload = multer({ storage: storage });

const router = require("express").Router();

router.post("/", isAuthenticated, addCourse);

router.post("/attendance", upload.single("file"), addSheet);

router.get("/", isAuthenticated, getCoursesByInstuctor);

router.delete("/course", isAuthenticated, deleteCourse);

module.exports = router;
