const Contact = require("../models/Contact");

// ================= CREATE CONTACT =================

const createContact = async (req, res) => {
  try {
    const {
      name,
      phone,
      email,
      subject,
      message,
    } = req.body;

    if (!name || !phone || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const contact = await Contact.create({
      name,
      phone,
      email,
      subject,
      message,
    });

    return res.status(201).json({
      success: true,
      message: "Message sent successfully",
      data: contact,
    });
  } catch (error) {
    console.error("Create contact error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to send message",
      error: error.message,
    });
  }
};


// ================= GET ALL CONTACTS =================

const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      message: "Contacts fetched successfully",
      data: contacts,
    });
  } catch (error) {
    console.error("Get contacts error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch contacts",
      error: error.message,
    });
  }
};


// ================= GET SINGLE CONTACT =================

const getContactById = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: contact,
    });
  } catch (error) {
    console.error("Get contact error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch contact",
      error: error.message,
    });
  }
};


// ================= UPDATE STATUS =================

const updateContactStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      "New",
      "Read",
      "Replied",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Contact status updated successfully",
      data: contact,
    });
  } catch (error) {
    console.error("Update contact status error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update contact status",
      error: error.message,
    });
  }
};


// ================= DELETE CONTACT =================

const deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact not found",
      });
    }

    await Contact.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Contact deleted successfully",
    });
  } catch (error) {
    console.error("Delete contact error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete contact",
      error: error.message,
    });
  }
};


module.exports = {
  createContact,
  getContacts,
  getContactById,
  updateContactStatus,
  deleteContact,
};