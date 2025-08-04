const express = require("express");
const upload = require("../middlewares/imgUpload");
const authenticate = require("../middlewares/auth");
require("dotenv").config();

const profileController = require("../controllers/profile");

const router = express.Router();

router.get("/getalldata", authenticate, profileController.getalldata);

router.put("/updateemail", authenticate, profileController.updateemail);

router.get("/verify/:id/:token", profileController.verifyemail);

router.put("/updatepwd", authenticate, profileController.updatepwd);

router.put("/updateuser", authenticate, profileController.updateuser);

router.delete("/deleteaccount", profileController.deleteaccount);

router.post(
  "/uploadimg",
  authenticate,
  upload.single("image"),
  profileController.uploadimg
);

module.exports = router;
