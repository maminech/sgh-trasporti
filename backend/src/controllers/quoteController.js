const Quote = require('../models/Quote');
const { sendQuoteConfirmation, notifyAdminNewQuote } = require('../services/emailService');

// @desc    Create quote request
// @route   POST /api/quotes
// @access  Public
exports.createQuote = async (req, res, next) => {
  try {
    const quote = await Quote.create(req.body);

    // Send confirmation email
    await sendQuoteConfirmation(quote.customerInfo.email, quote);
    
    // Notify admin
    await notifyAdminNewQuote(quote);

    res.status(201).json({
      success: true,
      message: 'Quote request submitted successfully',
      data: quote,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all quotes
// @route   GET /api/quotes
// @access  Private/Admin
exports.getAllQuotes = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    const query = {};
    if (status) query.status = status;

    const quotes = await Quote.find(query)
      .sort('-createdAt')
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Quote.countDocuments(query);

    res.json({
      success: true,
      count: quotes.length,
      total: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      data: quotes,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single quote
// @route   GET /api/quotes/:id
// @access  Private/Admin
exports.getQuote = async (req, res, next) => {
  try {
    const quote = await Quote.findById(req.params.id);

    if (!quote) {
      return res.status(404).json({
        success: false,
        message: 'Quote not found',
      });
    }

    res.json({
      success: true,
      data: quote,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update quote (add pricing, change status)
// @route   PUT /api/quotes/:id
// @access  Private/Admin
exports.updateQuote = async (req, res, next) => {
  try {
    const quote = await Quote.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!quote) {
      return res.status(404).json({
        success: false,
        message: 'Quote not found',
      });
    }

    res.json({
      success: true,
      message: 'Quote updated successfully',
      data: quote,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete quote
// @route   DELETE /api/quotes/:id
// @access  Private/Admin
exports.deleteQuote = async (req, res, next) => {
  try {
    const quote = await Quote.findById(req.params.id);

    if (!quote) {
      return res.status(404).json({
        success: false,
        message: 'Quote not found',
      });
    }

    await quote.deleteOne();

    res.json({
      success: true,
      message: 'Quote deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
