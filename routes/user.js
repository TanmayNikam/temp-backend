const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth");

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.get("/user", authController.isAuthenticated, authController.getUser);

module.exports = router;
