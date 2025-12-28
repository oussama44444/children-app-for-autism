const express = require("express");
const upload = require("../middlewares/imgUpload"); // Import Multer middleware

require("dotenv").config();

const router = express.Router();

const adminController = require("../controllers/admin");


router.post("/login", adminController.login);


module.exports = router;
