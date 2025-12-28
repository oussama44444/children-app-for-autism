const express = require("express");
const upload = require("../middlewares/imgUpload");
const authenticate = require("../middlewares/auth");
require("dotenv").config();

const profileController = require("../controllers/profile");

const router = express.Router();

router.get("/getalldata", authenticate, profileController.getalldata);

router.put("/updateemail", authenticate, profileController.updateemail);

router.get("/verify/:id/:token", profileController.verifyemail);

router.post("/forget-password", profileController.forgetPassword);
router.post("/reset-password", profileController.resetPassword);

router.put("/updateuser", authenticate, upload.single('image'),profileController.updateuser);

router.delete("/deleteaccount", profileController.deleteaccount);


module.exports = router;
