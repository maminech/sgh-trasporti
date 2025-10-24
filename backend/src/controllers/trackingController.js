const Booking = require('../models/Booking');

// @desc    Track shipment by tracking code
// @route   GET /api/tracking/:code
// @access  Public
exports.trackShipment = async (req, res, next) => {
  try {
    const booking = await Booking.findOne({ trackingCode: req.params.code })
      .populate('assignedVehicle', 'name type licensePlate')
      .populate('assignedDriver', 'name phone')
      .select('-internalNotes -user');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Tracking code not found',
      });
    }

    res.json({
      success: true,
      data: {
        trackingCode: booking.trackingCode,
        status: booking.status,
        origin: booking.origin,
        destination: booking.destination,
        currentLocation: booking.currentLocation,
        estimatedDelivery: booking.estimatedDelivery,
        pickupDate: booking.pickupDate,
        deliveryDate: booking.deliveryDate,
        statusHistory: booking.statusHistory,
        assignedVehicle: booking.assignedVehicle,
        assignedDriver: booking.assignedDriver ? {
          name: booking.assignedDriver.name,
          phone: booking.assignedDriver.phone,
        } : null,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update shipment location (for drivers/admin)
// @route   PUT /api/tracking/:id/location
// @access  Private (Admin/Driver)
exports.updateLocation = async (req, res, next) => {
  try {
    const { address, city, coordinates } = req.body;

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    // Check if user is assigned driver or admin
    if (req.user.role !== 'admin' && booking.assignedDriver?.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this shipment',
      });
    }

    booking.currentLocation = {
      address,
      city,
      coordinates,
      lastUpdate: new Date(),
    };

    await booking.save();

    res.json({
      success: true,
      message: 'Location updated successfully',
      data: booking.currentLocation,
    });
  } catch (error) {
    next(error);
  }
};
