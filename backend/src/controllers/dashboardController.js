const Booking = require('../models/Booking');
const Quote = require('../models/Quote');
const Vehicle = require('../models/Vehicle');
const User = require('../models/User');
const Contact = require('../models/Contact');

// @desc    Get dashboard statistics
// @route   GET /api/dashboard/stats
// @access  Private/Admin
exports.getDashboardStats = async (req, res, next) => {
  try {
    // Get counts
    const totalBookings = await Booking.countDocuments();
    const activeBookings = await Booking.countDocuments({ 
      status: { $in: ['confirmed', 'in_transit', 'out_for_delivery'] } 
    });
    const pendingQuotes = await Quote.countDocuments({ status: 'pending' });
    const totalClients = await User.countDocuments({ role: 'client' });
    const availableVehicles = await Vehicle.countDocuments({ status: 'available' });
    const pendingContacts = await Contact.countDocuments({ status: 'new' });

    // Get recent bookings
    const recentBookings = await Booking.find()
      .sort('-createdAt')
      .limit(5)
      .populate('assignedVehicle', 'name licensePlate');

    // Get bookings by status
    const bookingsByStatus = await Booking.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    // Get revenue data (if prices are set)
    const revenueData = await Booking.aggregate([
      {
        $match: {
          'price.final': { $exists: true, $ne: null },
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$price.final' },
        },
      },
    ]);

    res.json({
      success: true,
      data: {
        stats: {
          totalBookings,
          activeBookings,
          pendingQuotes,
          totalClients,
          availableVehicles,
          pendingContacts,
          totalRevenue: revenueData[0]?.totalRevenue || 0,
        },
        recentBookings,
        bookingsByStatus,
      },
    });
  } catch (error) {
    next(error);
  }
};
