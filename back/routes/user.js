const express = require("express");

require("dotenv").config();

const router = express.Router();

const userController = require("../controllers/user");

router.post("/login", userController.login);

router.post("/register", userController.register);

router.get("/verify/:id/:token", userController.verifyEmail); //server version
router.get("/:userId/reviews", userController.getReviews);

// router.get("/verify/:id/:token", async (req, res) => {  //client version
//   try {
//     await userController.verifyEmail(req, res);
//   } catch (error) {
//     console.error(error);
//     return res.redirect(
//       `${
//         process.env.FRONTEND_URL
//       }/login?success=false&message=${encodeURIComponent("An error occurred.")}`
//     );
//   }
// });

router.post("/forget-password", userController.forgetPassword);

router.post("/reset-password", userController.resetPassword);
router.post("/reports", userController.sendReport);

module.exports = router;
