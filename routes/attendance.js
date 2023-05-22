const {
  addAttendance,
  getAttendaceByCourse,
} = require("../controllers/attendance");
const { isAuthenticated } = require("../controllers/auth");
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

router.post("/", isAuthenticated, upload.single("file"), addAttendance);

module.exports = router;
