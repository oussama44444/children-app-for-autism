const express = require("express");
const upload = require("../middlewares/imgUpload"); // Import Multer middleware

require("dotenv").config();

const router = express.Router();

const adminController = require("../controllers/admin");

const isadmin = require("../middlewares/adminAuth");

router.post("/add", isadmin, adminController.add);

router.get("/getallusers", isadmin, adminController.getall);
router.get("/getProviders", isadmin, adminController.getProviders);

router.post(
  "/provider",
  isadmin,

  adminController.addProvider
);
router.put("/provider/:id", isadmin, adminController.modifyProvider);
router.delete("/provider/:id", isadmin, adminController.deleteProviderById);
router.get("/getprovider", isadmin, adminController.getproviders);

router.post(
  "/provider",
  isadmin,
  upload.single("image"),
  adminController.addprovider
);
router.put("/provider/:id", isadmin, adminController.modifyprovider);
router.delete("/provider/:id", isadmin, adminController.deleteproviderById);

router.get("/orders", isadmin, adminController.getallOrders);

router.get("/getbyid/:id", isadmin, adminController.getbyid);

router.get("/getbyemail/:email", isadmin, adminController.getbyemail);

router.delete("/deletebyid/:id", isadmin, adminController.deletebyid);

router.delete("/deletebyemail/:email", isadmin, adminController.deletebyemail);

router.put("/update/:id", isadmin, adminController.updatebyid);
router.put("/orders/:id", isadmin, adminController.updateOrderById);

router.post("/login", adminController.login);

// router.post("/createadmin", adminController.createadmin);
router.post("/slider", isadmin, adminController.addToSlider);
router.get("/slider", adminController.getSlider);
router.delete("/slider/:id", isadmin, adminController.deleteImagebyid);
router.put("/slider/:id", isadmin, adminController.updateImageById);
router.get("/reports", isadmin, adminController.getallReports);
router.get("/reports/:id", isadmin, adminController.getReportById);
router.put("/reports/:id", isadmin, adminController.modifyReport);
router.delete("/reports/:id", isadmin, adminController.deleteReportById);

module.exports = router;
