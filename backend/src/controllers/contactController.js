const Contact = require('../models/Contact');
const { sendContactConfirmation } = require('../services/emailService');

// @desc    Submit contact form
// @route   POST /api/contact
// @access  Public
exports.submitContact = async (req, res, next) => {
  try {
    const contactData = {
      ...req.body,
      ipAddress: req.ip,
    };

    const contact = await Contact.create(contactData);

    // Send confirmation email
    await sendContactConfirmation(contact.email, contact);

    res.status(201).json({
      success: true,
      message: 'Message sent successfully. We will get back to you soon!',
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all contact messages
// @route   GET /api/contact
// @access  Private/Admin
exports.getAllContacts = async (req, res, next) => {
  try {
    const { status, type, page = 1, limit = 10 } = req.query;

    const query = {};
    if (status) query.status = status;
    if (type) query.type = type;

    const contacts = await Contact.find(query)
      .sort('-createdAt')
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Contact.countDocuments(query);

    res.json({
      success: true,
      count: contacts.length,
      total: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      data: contacts,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update contact message
// @route   PUT /api/contact/:id
// @access  Private/Admin
exports.updateContact = async (req, res, next) => {
  try {
    const contact = await Contact.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact message not found',
      });
    }

    res.json({
      success: true,
      message: 'Contact updated successfully',
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete contact message
// @route   DELETE /api/contact/:id
// @access  Private/Admin
exports.deleteContact = async (req, res, next) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact message not found',
      });
    }

    res.json({
      success: true,
      message: 'Contact message deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
