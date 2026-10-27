const express = require("express");

const {
  createGallery,
  getGallery,
  updateGallery,
  deleteGallery,
} = require("../controllers/galleryController");

const upload = require("../middleware/upload");

const router = express.Router();

router.post("/", upload.single("image"), createGallery);

router.get("/", getGallery);

router.put("/:id", upload.single("image"), updateGallery);

router.delete("/:id", deleteGallery);

module.exports = router;