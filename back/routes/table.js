const express = require("express");
const router = express.Router();
const tableController = require("../controllers/table");
const isProvider = require("../middlewares/providerAuth");
const providerController = require("../controllers/provider");
// Create a new table (Provider only)
router.post("/", isProvider, providerController.createTable);

// Get all tables for a provider (Authenticated users only)
router.get(
  "/provider/:providerId",
  tableController.getAllTablesByprovider
);

// Get a table by ID (Authenticated users only)
router.get("/:tableId", isProvider, tableController.getTableById);

// Update a table (Provider only)
router.put("/:tableId", isProvider, tableController.updateTable);

// Delete a table (Provider only)
router.delete("/:tableId", isProvider, tableController.deleteTable);

module.exports = router;
