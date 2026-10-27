const express = require("express");

const {
  createContact,
  getContacts,
  getContactById,
  updateContactStatus,
  deleteContact,
} = require("../controllers/contactController");

const router = express.Router();

router.post("/", createContact);

router.get("/", getContacts);

router.get("/:id", getContactById);

router.put("/:id", updateContactStatus);

router.delete("/:id", deleteContact);

module.exports = router;