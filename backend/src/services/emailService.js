const nodemailer = require('nodemailer');

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
};

// Send booking confirmation email
exports.sendBookingConfirmation = async (email, booking) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: `Booking Confirmation - ${booking.trackingCode}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1e40af;">Booking Confirmation</h2>
        <p>Dear ${booking.customerInfo.name},</p>
        <p>Thank you for choosing SGH Trasporti. Your booking has been confirmed.</p>
        
        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Booking Details</h3>
          <p><strong>Tracking Code:</strong> ${booking.trackingCode}</p>
          <p><strong>Pickup Date:</strong> ${new Date(booking.pickupDate).toLocaleDateString()}</p>
          <p><strong>From:</strong> ${booking.origin.city}, ${booking.origin.country}</p>
          <p><strong>To:</strong> ${booking.destination.city}, ${booking.destination.country}</p>
          <p><strong>Status:</strong> ${booking.status}</p>
        </div>
        
        <p>You can track your shipment using the tracking code at our website.</p>
        <p>If you have any questions, please don't hesitate to contact us.</p>
        
        <p style="margin-top: 30px;">Best regards,<br>SGH Trasporti Team</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('✅ Booking confirmation email sent');
  } catch (error) {
    console.error('❌ Email sending failed:', error);
  }
};

// Notify admin of new booking
exports.notifyAdminNewBooking = async (booking) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: process.env.ADMIN_EMAIL,
    subject: `New Booking - ${booking.trackingCode}`,
    html: `
      <div style="font-family: Arial, sans-serif;">
        <h2>New Booking Received</h2>
        <p><strong>Tracking Code:</strong> ${booking.trackingCode}</p>
        <p><strong>Customer:</strong> ${booking.customerInfo.name}</p>
        <p><strong>Email:</strong> ${booking.customerInfo.email}</p>
        <p><strong>Phone:</strong> ${booking.customerInfo.phone}</p>
        <p><strong>Route:</strong> ${booking.origin.city} → ${booking.destination.city}</p>
        <p><strong>Pickup Date:</strong> ${new Date(booking.pickupDate).toLocaleDateString()}</p>
        <p>Please review and assign a vehicle.</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('❌ Admin notification failed:', error);
  }
};

// Send quote confirmation
exports.sendQuoteConfirmation = async (email, quote) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'Quote Request Received - SGH Trasporti',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1e40af;">Quote Request Received</h2>
        <p>Dear ${quote.customerInfo.name},</p>
        <p>Thank you for your quote request. We have received your information and will respond within 24 hours.</p>
        
        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Request Details</h3>
          <p><strong>Route:</strong> ${quote.origin.city}, ${quote.origin.country} → ${quote.destination.city}, ${quote.destination.country}</p>
          <p><strong>Package Type:</strong> ${quote.packageDetails.type}</p>
          <p><strong>Service Type:</strong> ${quote.serviceType}</p>
        </div>
        
        <p>Our team will review your request and send you a detailed quote shortly.</p>
        
        <p style="margin-top: 30px;">Best regards,<br>SGH Trasporti Team</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('❌ Email sending failed:', error);
  }
};

// Notify admin of new quote
exports.notifyAdminNewQuote = async (quote) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: process.env.ADMIN_EMAIL,
    subject: 'New Quote Request',
    html: `
      <div style="font-family: Arial, sans-serif;">
        <h2>New Quote Request</h2>
        <p><strong>Customer:</strong> ${quote.customerInfo.name}</p>
        <p><strong>Email:</strong> ${quote.customerInfo.email}</p>
        <p><strong>Phone:</strong> ${quote.customerInfo.phone}</p>
        <p><strong>Route:</strong> ${quote.origin.city} → ${quote.destination.city}</p>
        <p><strong>Service:</strong> ${quote.serviceType}</p>
        <p>Please review and provide a quote.</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('❌ Admin notification failed:', error);
  }
};

// Send contact confirmation
exports.sendContactConfirmation = async (email, contact) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'Message Received - SGH Trasporti',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1e40af;">Thank You for Contacting Us</h2>
        <p>Dear ${contact.name},</p>
        <p>We have received your message and will get back to you as soon as possible.</p>
        
        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Your Message</h3>
          <p><strong>Subject:</strong> ${contact.subject}</p>
          <p><strong>Message:</strong></p>
          <p>${contact.message}</p>
        </div>
        
        <p style="margin-top: 30px;">Best regards,<br>SGH Trasporti Team</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('❌ Email sending failed:', error);
  }
};

// Notify admin of new application
exports.notifyAdminNewApplication = async (application) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: process.env.ADMIN_EMAIL,
    subject: `New Job Application - ${application.position}`,
    html: `
      <div style="font-family: Arial, sans-serif;">
        <h2>New Job Application</h2>
        <p><strong>Position:</strong> ${application.position}</p>
        <p><strong>Name:</strong> ${application.personalInfo.firstName} ${application.personalInfo.lastName}</p>
        <p><strong>Email:</strong> ${application.personalInfo.email}</p>
        <p><strong>Phone:</strong> ${application.personalInfo.phone}</p>
        <p><strong>Experience:</strong> ${application.experience.years || 'N/A'} years</p>
        <p>Please review the application in the admin dashboard.</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('❌ Admin notification failed:', error);
  }
};

// Send quote response to customer
exports.sendQuoteResponse = async (email, quote) => {
  const transporter = createTransporter();

  const validUntilDate = quote.quotedPrice?.validUntil 
    ? new Date(quote.quotedPrice.validUntil).toLocaleDateString() 
    : 'N/A';

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'Your Quote is Ready - SGH Trasporti',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1e40af;">Your Transportation Quote</h2>
        <p>Dear ${quote.customerInfo.name},</p>
        <p>Thank you for your patience. We are pleased to provide you with a quote for your transportation needs.</p>
        
        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #1e40af;">Route Details</h3>
          <p><strong>From:</strong> ${quote.origin.address ? quote.origin.address + ', ' : ''}${quote.origin.city}, ${quote.origin.country}</p>
          <p><strong>To:</strong> ${quote.destination.address ? quote.destination.address + ', ' : ''}${quote.destination.city}, ${quote.destination.country}</p>
          <p><strong>Service Type:</strong> ${quote.serviceType.toUpperCase()}</p>
          <p><strong>Package Type:</strong> ${quote.packageDetails.type}</p>
          ${quote.packageDetails.weight ? `<p><strong>Weight:</strong> ${quote.packageDetails.weight} kg</p>` : ''}
          ${quote.packageDetails.quantity ? `<p><strong>Quantity:</strong> ${quote.packageDetails.quantity}</p>` : ''}
        </div>

        <div style="background-color: #dcfce7; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #16a34a;">
          <h3 style="margin-top: 0; color: #16a34a;">Quoted Price</h3>
          <p style="font-size: 32px; font-weight: bold; color: #16a34a; margin: 10px 0;">
            ${quote.quotedPrice.currency} ${quote.quotedPrice.amount.toFixed(2)}
          </p>
          <p style="margin: 5px 0;"><strong>Valid Until:</strong> ${validUntilDate}</p>
        </div>

        ${quote.notes ? `
        <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Additional Notes</h3>
          <p>${quote.notes}</p>
        </div>
        ` : ''}
        
        <p>To proceed with this quote and book your shipment, please reply to this email or contact us at:</p>
        <ul>
          <li><strong>Email:</strong> ${process.env.EMAIL_FROM || 'service.sgh.trasporti@hotmail.com'}</li>
          <li><strong>Phone:</strong> +39 XXX XXX XXXX</li>
        </ul>
        
        <p style="font-size: 12px; color: #666; margin-top: 30px;">
          This quote is valid until the date specified above. Prices may vary based on fuel costs, route changes, or additional requirements.
        </p>
        
        <p style="margin-top: 30px;">Best regards,<br>SGH Trasporti Team</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('✅ Quote response email sent to customer');
  } catch (error) {
    console.error('❌ Quote response email failed:', error);
    throw error;
  }
};
