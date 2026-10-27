const cloudinary = require("../config/cloudinary");
const Gallery = require("../models/Gallery");
const streamifier = require("streamifier");

// Upload image to Cloudinary
const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "maa-bird-foundation/gallery",
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


// CREATE GALLERY
const createGallery = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Title is required",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Image is required",
      });
    }

    // Upload image to Cloudinary
    const uploadedImage = await uploadToCloudinary(req.file.buffer);

    // Save gallery in MongoDB
    const gallery = await Gallery.create({
      title,
      image: uploadedImage.secure_url,
      description: description || "",
    });

    res.status(201).json({
      success: true,
      message: "Gallery item created successfully",
      data: gallery,
    });
  } catch (error) {
    console.error("Create Gallery Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create gallery item",
      error: error.message,
    });
  }
};


// GET ALL GALLERY
const getGallery = async (req, res) => {
  try {
    const gallery = await Gallery.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "Gallery fetched successfully",
      data: gallery,
    });
  } catch (error) {
    console.error("Get Gallery Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch gallery",
      error: error.message,
    });
  }
};


// UPDATE GALLERY
const updateGallery = async (req, res) => {
  try {
    const { title, description } = req.body;

    const gallery = await Gallery.findById(req.params.id);

    if (!gallery) {
      return res.status(404).json({
        success: false,
        message: "Gallery item not found",
      });
    }

    gallery.title = title;
    gallery.description = description || "";

    // Agar new image upload hui hai
    if (req.file) {
      const uploadedImage = await uploadToCloudinary(req.file.buffer);

      gallery.image = uploadedImage.secure_url;
    }

    await gallery.save();

    res.status(200).json({
      success: true,
      message: "Gallery item updated successfully",
      data: gallery,
    });
  } catch (error) {
    console.error("Update Gallery Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update gallery item",
      error: error.message,
    });
  }
};


// DELETE GALLERY
const deleteGallery = async (req, res) => {
  try {
    const gallery = await Gallery.findByIdAndDelete(req.params.id);

    if (!gallery) {
      return res.status(404).json({
        success: false,
        message: "Gallery item not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Gallery item deleted successfully",
      data: gallery,
    });
  } catch (error) {
    console.error("Delete Gallery Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete gallery item",
      error: error.message,
    });
  }
};


module.exports = {
  createGallery,
  getGallery,
  updateGallery,
  deleteGallery,
};