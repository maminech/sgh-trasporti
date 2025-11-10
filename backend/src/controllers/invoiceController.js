const Invoice = require('../models/Invoice');
const Booking = require('../models/Booking');
const User = require('../models/User');
const InvoicePDFService = require('../services/invoicePDFService');
const emailService = require('../services/emailService');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

/**
 * @desc    Create invoice for a booking
 * @route   POST /api/invoices
 * @access  Private (Admin only)
 */
exports.createInvoice = async (req, res, next) => {
  try {
    const {
      bookingId,
      items,
      dueDate,
      notes,
      paymentMethod
    } = req.body;

    const booking = await Booking.findById(bookingId).populate('customer');
    
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // Check if invoice already exists
    const existingInvoice = await Invoice.findOne({ booking: bookingId });
    if (existingInvoice) {
      return res.status(400).json({
        success: false,
        message: 'Invoice already exists for this booking'
      });
    }

    // Calculate totals
    let subtotal = 0;
    let taxAmount = 0;

    const invoiceItems = items.map(item => {
      const itemTotal = item.quantity * item.unitPrice;
      const itemTax = itemTotal * (item.taxRate || 22) / 100;
      
      subtotal += itemTotal;
      taxAmount += itemTax;

      return {
        ...item,
        total: itemTotal
      };
    });

    const totalAmount = subtotal + taxAmount;

    // Create invoice
    const invoice = await Invoice.create({
      booking: bookingId,
      customer: booking.customer._id,
      customerDetails: {
        name: booking.customer.name,
        email: booking.customer.email,
        phone: booking.customer.phone,
        company: booking.customer.company,
        address: booking.customer.address,
        vatNumber: booking.customer.vatNumber,
        fiscalCode: booking.customer.fiscalCode
      },
      items: invoiceItems,
      subtotal,
      taxAmount,
      totalAmount,
      dueDate: dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      notes,
      paymentMethod: paymentMethod || 'bank_transfer',
      status: 'sent'
    });

    res.status(201).json({
      success: true,
      data: invoice
    });

  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all invoices (with filters)
 * @route   GET /api/invoices
 * @access  Private (Admin can see all, Customer can see own)
 */
exports.getAllInvoices = async (req, res, next) => {
  try {
    const { status, customer, startDate, endDate, page = 1, limit = 10 } = req.query;

    const query = {};

    // If user is not admin, only show their invoices
    if (req.user.role !== 'admin') {
      query.customer = req.user._id;
    } else if (customer) {
      query.customer = customer;
    }

    if (status) {
      query.status = status;
    }

    if (startDate || endDate) {
      query.issueDate = {};
      if (startDate) query.issueDate.$gte = new Date(startDate);
      if (endDate) query.issueDate.$lte = new Date(endDate);
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const invoices = await Invoice.find(query)
      .populate('customer', 'name email company')
      .populate('booking', 'trackingCode origin destination')
      .sort({ issueDate: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Invoice.countDocuments(query);

    res.status(200).json({
      success: true,
      count: invoices.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      data: invoices
    });

  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single invoice
 * @route   GET /api/invoices/:id
 * @access  Private
 */
exports.getInvoice = async (req, res, next) => {
  try {
    const invoice = await Invoice.findById(req.params.id)
      .populate('customer', 'name email company phone')
      .populate('booking', 'trackingCode origin destination status');

    if (!invoice) {
      return res.status(404).json({ success: false, message: 'Invoice not found' });
    }

    // Check authorization
    if (req.user.role !== 'admin' && invoice.customer._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this invoice'
      });
    }

    res.status(200).json({
      success: true,
      data: invoice
    });

  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update invoice
 * @route   PUT /api/invoices/:id
 * @access  Private (Admin only)
 */
exports.updateInvoice = async (req, res, next) => {
  try {
    const { status, paymentDate, paymentMethod, notes } = req.body;

    const invoice = await Invoice.findById(req.params.id);

    if (!invoice) {
      return res.status(404).json({ success: false, message: 'Invoice not found' });
    }

    if (status) invoice.status = status;
    if (paymentDate) invoice.paymentDate = paymentDate;
    if (paymentMethod) invoice.paymentMethod = paymentMethod;
    if (notes !== undefined) invoice.notes = notes;

    await invoice.save();

    res.status(200).json({
      success: true,
      data: invoice
    });

  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete invoice
 * @route   DELETE /api/invoices/:id
 * @access  Private (Admin only)
 */
exports.deleteInvoice = async (req, res, next) => {
  try {
    const invoice = await Invoice.findById(req.params.id);

    if (!invoice) {
      return res.status(404).json({ success: false, message: 'Invoice not found' });
    }

    // Delete PDF file if exists
    if (invoice.pdfUrl) {
      const pdfPath = path.join(__dirname, '../../', invoice.pdfUrl);
      if (fs.existsSync(pdfPath)) {
        fs.unlinkSync(pdfPath);
      }
    }

    await invoice.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Invoice deleted successfully'
    });

  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Generate invoice PDF
 * @route   GET /api/invoices/:id/pdf
 * @access  Private
 */
exports.generateInvoicePDF = async (req, res, next) => {
  try {
    const invoice = await Invoice.findById(req.params.id)
      .populate('customer', 'name email company phone')
      .populate('booking', 'trackingCode origin destination');

    if (!invoice) {
      return res.status(404).json({ success: false, message: 'Invoice not found' });
    }

    // Check authorization
    if (req.user.role !== 'admin' && invoice.customer._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this invoice'
      });
    }

    // Create PDF
    const doc = new PDFDocument({ margin: 50 });

    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=invoice-${invoice.invoiceNumber}.pdf`);

    // Pipe PDF to response
    doc.pipe(res);

    // Company header
    doc.fontSize(20).text('SGH Trasporti', 50, 50);
    doc.fontSize(10).text('Via Example, 123', 50, 75);
    doc.text('Milan, Italy', 50, 90);
    doc.text('VAT: IT12345678901', 50, 105);
    doc.text('Email: info@sghtrasporti.com', 50, 120);

    // Invoice title
    doc.fontSize(24).text('INVOICE', 400, 50);
    doc.fontSize(10).text(`Invoice #: ${invoice.invoiceNumber}`, 400, 80);
    doc.text(`Date: ${invoice.issueDate.toLocaleDateString()}`, 400, 95);
    doc.text(`Due Date: ${invoice.dueDate.toLocaleDateString()}`, 400, 110);

    // Customer details
    doc.fontSize(12).text('Bill To:', 50, 170);
    doc.fontSize(10).text(invoice.customerDetails.name || invoice.customer.name, 50, 190);
    if (invoice.customerDetails.company) {
      doc.text(invoice.customerDetails.company, 50, 205);
    }
    if (invoice.customerDetails.address) {
      const addr = invoice.customerDetails.address;
      doc.text(`${addr.street || ''}`, 50, 220);
      doc.text(`${addr.postalCode || ''} ${addr.city || ''}`, 50, 235);
      doc.text(`${addr.country || ''}`, 50, 250);
    }
    if (invoice.customerDetails.vatNumber) {
      doc.text(`VAT: ${invoice.customerDetails.vatNumber}`, 50, 270);
    }

    // Line separator
    doc.moveTo(50, 310).lineTo(550, 310).stroke();

    // Table header
    let y = 330;
    doc.fontSize(10).text('Description', 50, y);
    doc.text('Qty', 300, y);
    doc.text('Unit Price', 360, y);
    doc.text('Tax', 440, y);
    doc.text('Total', 500, y);

    doc.moveTo(50, y + 15).lineTo(550, y + 15).stroke();

    // Items
    y += 25;
    invoice.items.forEach(item => {
      doc.text(item.description, 50, y, { width: 240 });
      doc.text(item.quantity.toString(), 300, y);
      doc.text(`€${item.unitPrice.toFixed(2)}`, 360, y);
      doc.text(`${item.taxRate}%`, 440, y);
      doc.text(`€${item.total.toFixed(2)}`, 500, y);
      y += 20;
    });

    // Totals
    y += 20;
    doc.moveTo(50, y).lineTo(550, y).stroke();
    y += 15;

    doc.text('Subtotal:', 400, y);
    doc.text(`€${invoice.subtotal.toFixed(2)}`, 500, y);
    y += 20;

    doc.text('Tax:', 400, y);
    doc.text(`€${invoice.taxAmount.toFixed(2)}`, 500, y);
    y += 20;

    doc.fontSize(12).text('Total:', 400, y);
    doc.text(`€${invoice.totalAmount.toFixed(2)}`, 500, y);

    // Notes
    if (invoice.notes) {
      y += 40;
      doc.fontSize(10).text('Notes:', 50, y);
      doc.fontSize(9).text(invoice.notes, 50, y + 15, { width: 500 });
    }

    // Footer
    doc.fontSize(8).text(
      'Thank you for your business!',
      50,
      700,
      { align: 'center', width: 500 }
    );

    // Finalize PDF
    doc.end();

  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get invoice statistics
 * @route   GET /api/invoices/stats
 * @access  Private (Admin only)
 */
exports.getInvoiceStats = async (req, res, next) => {
  try {
    const totalInvoices = await Invoice.countDocuments();
    const paidInvoices = await Invoice.countDocuments({ status: 'paid' });
    const overdueInvoices = await Invoice.countDocuments({ status: 'overdue' });
    const pendingInvoices = await Invoice.countDocuments({ status: 'sent' });

    const totalRevenue = await Invoice.aggregate([
      { $match: { status: 'paid' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);

    const pendingAmount = await Invoice.aggregate([
      { $match: { status: { $in: ['sent', 'overdue'] } } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalInvoices,
        paidInvoices,
        overdueInvoices,
        pendingInvoices,
        totalRevenue: totalRevenue[0]?.total || 0,
        pendingAmount: pendingAmount[0]?.total || 0
      }
    });

  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Generate and send invoice for a booking
 * @route   POST /api/invoices/generate-send
 * @access  Private (Admin only)
 */
exports.generateAndSendInvoice = async (req, res, next) => {
  try {
    const { bookingId, items, dueDate, notes, paymentMethod } = req.body;

    // Get booking with customer details
    const booking = await Booking.findById(bookingId).populate('customer');
    
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // Check if invoice already exists
    let invoice = await Invoice.findOne({ booking: bookingId });
    
    if (invoice) {
      // If invoice exists, update status to sent and regenerate PDF
      invoice.status = 'sent';
    } else {
      // Calculate totals
      let subtotal = 0;
      let taxAmount = 0;

      const invoiceItems = items.map(item => {
        const itemTotal = item.quantity * item.unitPrice;
        const itemTax = itemTotal * (item.taxRate || 22) / 100;
        
        subtotal += itemTotal;
        taxAmount += itemTax;

        return {
          ...item,
          total: itemTotal
        };
      });

      const totalAmount = subtotal + taxAmount;

      // Create new invoice
      invoice = await Invoice.create({
        booking: bookingId,
        customer: booking.customer._id,
        customerDetails: {
          name: booking.customerInfo?.name || booking.customer.name,
          email: booking.customerInfo?.email || booking.customer.email,
          phone: booking.customerInfo?.phone || booking.customer.phone,
          company: booking.customerInfo?.company || booking.customer.company,
          address: booking.origin || booking.customer.address,
          vatNumber: booking.customer.vatNumber,
          fiscalCode: booking.customer.fiscalCode
        },
        items: invoiceItems,
        subtotal,
        taxAmount,
        totalAmount,
        dueDate: dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        notes,
        paymentMethod: paymentMethod || 'bank_transfer',
        status: 'sent'
      });
    }

    // Generate PDF
    const pdfFileName = `invoice-${invoice.invoiceNumber}.pdf`;
    const pdfPath = await InvoicePDFService.generateInvoicePDF(invoice, pdfFileName);

    // Update invoice with PDF URL
    invoice.pdfUrl = `/uploads/invoices/${pdfFileName}`;
    await invoice.save();

    // Send email with PDF attachment
    const customerEmail = invoice.customerDetails.email;
    const customerName = invoice.customerDetails.name;

    await emailService.sendInvoiceEmail(
      customerEmail,
      customerName,
      invoice,
      pdfPath
    );

    res.status(200).json({
      success: true,
      message: 'Invoice generated and sent successfully',
      data: invoice
    });

  } catch (error) {
    console.error('Error generating/sending invoice:', error);
    next(error);
  }
};

/**
 * @desc    Get invoices by customer
 * @route   GET /api/invoices/customer/:customerId
 * @access  Private (Admin only)
 */
exports.getInvoicesByCustomer = async (req, res, next) => {
  try {
    const { customerId } = req.params;

    const invoices = await Invoice.find({ customer: customerId })
      .populate('booking', 'trackingCode origin destination status')
      .sort({ issueDate: -1 });

    res.status(200).json({
      success: true,
      count: invoices.length,
      data: invoices
    });

  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Upload pre-made invoice PDF
 * @route   POST /api/invoices/upload
 * @access  Private (Admin only)
 */
exports.uploadInvoice = async (req, res, next) => {
  try {
    const { customerId, notes } = req.body;

    if (!req.files || !req.files.invoice) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please upload an invoice file' 
      });
    }

    const invoiceFile = req.files.invoice;

    // Validate file type
    if (invoiceFile.mimetype !== 'application/pdf') {
      return res.status(400).json({
        success: false,
        message: 'Only PDF files are allowed'
      });
    }

    // Validate file size (10MB max)
    if (invoiceFile.size > 10 * 1024 * 1024) {
      return res.status(400).json({
        success: false,
        message: 'File size must be less than 10MB'
      });
    }

    // Get customer details
    const customer = await User.findById(customerId);
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(__dirname, '../../uploads/invoices');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const fileName = `uploaded-invoice-${customerId}-${timestamp}.pdf`;
    const filePath = path.join(uploadsDir, fileName);

    // Move file to uploads directory
    await invoiceFile.mv(filePath);

    // Create invoice record
    const invoice = await Invoice.create({
      customer: customerId,
      customerDetails: {
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        company: customer.company,
        address: customer.address,
        vatNumber: customer.vatNumber,
        fiscalCode: customer.fiscalCode
      },
      items: [{
        description: 'Uploaded invoice',
        quantity: 1,
        unitPrice: 0,
        total: 0
      }],
      subtotal: 0,
      taxAmount: 0,
      totalAmount: 0,
      pdfUrl: `/uploads/invoices/${fileName}`,
      notes: notes || 'Uploaded invoice',
      status: 'sent',
      isUploaded: true
    });

    // Send email with uploaded invoice
    await emailService.sendInvoiceEmail(
      customer.email,
      customer.name,
      invoice,
      filePath
    );

    res.status(201).json({
      success: true,
      message: 'Invoice uploaded and sent successfully',
      data: invoice
    });

  } catch (error) {
    console.error('Error uploading invoice:', error);
    next(error);
  }
};
