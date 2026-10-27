const mongoose = require("mongoose");

const volunteerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    area: {
      type: String,
      required: true,
      trim: true,
    },

    availability: {
      type: String,
      required: true,
      enum: ["weekdays", "weekends", "both", "flexible"],
    },

    interest: {
      type: String,
      required: true,
      enum: ["rescue", "bird-care", "awareness", "events", "other"],
    },

    message: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Volunteer", volunteerSchema);