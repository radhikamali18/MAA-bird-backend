const Volunteer = require("../models/Volunteer");

const createVolunteer = async (req, res) => {
  try {
    const {
      name,
      phone,
      email,
      area,
      availability,
      interest,
      message,
    } = req.body;

    if (
      !name ||
      !phone ||
      !email ||
      !area ||
      !availability ||
      !interest ||
      !message
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const volunteer = await Volunteer.create({
      name,
      phone,
      email,
      area,
      availability,
      interest,
      message,
    });

    res.status(201).json({
      success: true,
      message: "Volunteer application submitted successfully",
      data: volunteer,
    });
  } catch (error) {
    console.error("Create Volunteer Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to submit volunteer application",
      error: error.message,
    });
  }
};
const getVolunteers = async (req, res) => {
  try {
    const volunteers = await Volunteer.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "Volunteers fetched successfully",
      data: volunteers,
    });
  } catch (error) {
    console.error("Get Volunteers Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch volunteers",
      error: error.message,
    });
  }
};

module.exports = {
  createVolunteer,
    getVolunteers,
};