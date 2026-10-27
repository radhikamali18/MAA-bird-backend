const express = require("express");

const {
  createReport,
  getReports,
  getReportById,
  updateReport,
  deleteReport,
} = require("../controllers/reportController");

const upload = require("../middleware/upload");

const router = express.Router();

// Create report
router.post(
  "/",
  upload.single("image"),
  createReport
);

// Get all reports
router.get("/", getReports);

// Get single report
router.get("/:id", getReportById);

// Update report status
router.put("/:id", updateReport);

// Delete report
router.delete("/:id", deleteReport);

module.exports = router;