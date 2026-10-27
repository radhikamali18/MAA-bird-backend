const Report = require("../models/Report");
const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");

// ========================================
// Upload image to Cloudinary
// ========================================

const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "maa-bird-foundation/reports",
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );

    streamifier.createReadStream(buffer).pipe(stream);
  });
};

// ========================================
// CREATE REPORT
// POST /api/reports
// ========================================

const createReport = async (req, res) => {
  try {
    const {
      condition,
      description,
      location,
      name,
      phone,
      latitude,
      longitude,
      mapLink,
    } = req.body;

    // Required fields
    if (!condition) {
      return res.status(400).json({
        success: false,
        message: "Bird condition is required",
      });
    }

    if (!location) {
      return res.status(400).json({
        success: false,
        message: "Bird location is required",
      });
    }

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Name is required",
      });
    }

    if (!phone) {
      return res.status(400).json({
        success: false,
        message: "Phone number is required",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Bird photo is required",
      });
    }

    // Upload image
    const uploadedImage = await uploadToCloudinary(
      req.file.buffer
    );

    // Create report
    const report = await Report.create({
      image: uploadedImage.secure_url,

      condition,

      description: description || "",

      location,

      name,

      phone,

      latitude:
        latitude !== undefined &&
        latitude !== ""
          ? Number(latitude)
          : null,

      longitude:
        longitude !== undefined &&
        longitude !== ""
          ? Number(longitude)
          : null,

      mapLink: mapLink || "",

      status: "Pending",
    });

    return res.status(201).json({
      success: true,
      message: "Bird report submitted successfully",
      data: report,
    });
  } catch (error) {
    console.error("Create Report Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to submit bird report",
      error: error.message,
    });
  }
};

// ========================================
// GET ALL REPORTS
// GET /api/reports
// ========================================

const getReports = async (req, res) => {
  try {
    const reports = await Report.find()
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Reports fetched successfully",
      data: reports,
    });
  } catch (error) {
    console.error("Get Reports Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch reports",
      error: error.message,
    });
  }
};

// ========================================
// GET SINGLE REPORT
// GET /api/reports/:id
// ========================================

const getReportById = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Report fetched successfully",
      data: report,
    });
  } catch (error) {
    console.error("Get Report Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch report",
      error: error.message,
    });
  }
};

// ========================================
// UPDATE REPORT STATUS
// PUT /api/reports/:id
// ========================================

const updateReport = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required",
      });
    }

    const allowedStatus = [
      "Pending",
      "Under Care",
      "Recovered",
    ];

    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    const report = await Report.findByIdAndUpdate(
      req.params.id,
      { status },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Report status updated successfully",
      data: report,
    });
  } catch (error) {
    console.error("Update Report Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update report",
      error: error.message,
    });
  }
};

// ========================================
// DELETE REPORT
// DELETE /api/reports/:id
// ========================================

const deleteReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found",
      });
    }

    await Report.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Report deleted successfully",
    });
  } catch (error) {
    console.error("Delete Report Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete report",
      error: error.message,
    });
  }
};

module.exports = {
  createReport,
  getReports,
  getReportById,
  updateReport,
  deleteReport,
};