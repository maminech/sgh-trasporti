const GPSLocation = require('../models/GPSLocation');
const Booking = require('../models/Booking');
const gpsSimulator = require('../services/gpsSimulator');

/**
 * @desc    Get GPS location history for a booking
 * @route   GET /api/gps/booking/:bookingId
 * @access  Private (Customer can view own bookings, Admin can view all)
 */
exports.getBookingGPSHistory = async (req, res, next) => {
  try {
    const { bookingId } = req.params;
    const { limit = 100, startDate, endDate } = req.query;

    // Check if user has access to this booking
    const booking = await Booking.findById(bookingId);
    
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    if (req.user.role !== 'admin' && booking.customer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this tracking' });
    }

    // Build query
    const query = { booking: bookingId };
    
    if (startDate || endDate) {
      query.timestamp = {};
      if (startDate) query.timestamp.$gte = new Date(startDate);
      if (endDate) query.timestamp.$lte = new Date(endDate);
    }

    const locations = await GPSLocation.find(query)
      .sort({ timestamp: -1 })
      .limit(parseInt(limit))
      .populate('vehicle', 'name licensePlate');

    res.status(200).json({
      success: true,
      count: locations.length,
      data: locations
    });

  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get current GPS location for a booking
 * @route   GET /api/gps/booking/:bookingId/current
 * @access  Public (via tracking code) or Private
 */
exports.getCurrentLocation = async (req, res, next) => {
  try {
    const { bookingId } = req.params;

    const booking = await Booking.findById(bookingId)
      .populate('assignedVehicle', 'name licensePlate')
      .populate('assignedDriver', 'name phone');
    
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // Get latest GPS location
    const currentLocation = await GPSLocation.findOne({ booking: bookingId })
      .sort({ timestamp: -1 })
      .populate('vehicle', 'name licensePlate');

    if (!currentLocation) {
      return res.status(404).json({
        success: false,
        message: 'No GPS data available for this booking'
      });
    }

    // Calculate progress percentage
    const totalDistance = gpsSimulator.calculateDistance(
      booking.origin.coordinates.latitude,
      booking.origin.coordinates.longitude,
      booking.destination.coordinates.latitude,
      booking.destination.coordinates.longitude
    );

    const coveredDistance = gpsSimulator.calculateDistance(
      booking.origin.coordinates.latitude,
      booking.origin.coordinates.longitude,
      currentLocation.coordinates.latitude,
      currentLocation.coordinates.longitude
    );

    const progressPercentage = Math.min(100, Math.round((coveredDistance / totalDistance) * 100));

    // Calculate ETA
    const remainingDistance = totalDistance - coveredDistance;
    const averageSpeed = currentLocation.speed || 50; // Default 50 km/h
    const etaHours = remainingDistance / averageSpeed;
    const eta = new Date(Date.now() + etaHours * 60 * 60 * 1000);

    res.status(200).json({
      success: true,
      data: {
        booking: {
          trackingCode: booking.trackingCode,
          status: booking.status,
          origin: booking.origin,
          destination: booking.destination,
          estimatedDeliveryDate: booking.estimatedDeliveryDate,
          vehicle: booking.assignedVehicle,
          driver: booking.assignedDriver
        },
        currentLocation: {
          coordinates: currentLocation.coordinates,
          speed: currentLocation.speed,
          heading: currentLocation.heading,
          status: currentLocation.status,
          timestamp: currentLocation.timestamp,
          address: currentLocation.address
        },
        progress: {
          percentage: progressPercentage,
          totalDistance: Math.round(totalDistance * 100) / 100,
          coveredDistance: Math.round(coveredDistance * 100) / 100,
          remainingDistance: Math.round(remainingDistance * 100) / 100,
          estimatedArrival: eta
        }
      }
    });

  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get GPS locations for a vehicle
 * @route   GET /api/gps/vehicle/:vehicleId
 * @access  Private (Admin only)
 */
exports.getVehicleGPSHistory = async (req, res, next) => {
  try {
    const { vehicleId } = req.params;
    const { limit = 100, startDate, endDate } = req.query;

    const query = { vehicle: vehicleId };
    
    if (startDate || endDate) {
      query.timestamp = {};
      if (startDate) query.timestamp.$gte = new Date(startDate);
      if (endDate) query.timestamp.$lte = new Date(endDate);
    }

    const locations = await GPSLocation.find(query)
      .sort({ timestamp: -1 })
      .limit(parseInt(limit))
      .populate('booking', 'trackingCode origin destination');

    res.status(200).json({
      success: true,
      count: locations.length,
      data: locations
    });

  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all active vehicle locations (for fleet map)
 * @route   GET /api/gps/fleet/active
 * @access  Private (Admin only)
 */
exports.getActiveFleetLocations = async (req, res, next) => {
  try {
    // Get all active bookings
    const activeBookings = await Booking.find({
      status: { $in: ['in_transit', 'pickup'] }
    })
    .populate('assignedVehicle', 'name licensePlate type')
    .populate('assignedDriver', 'name phone');

    const fleetLocations = await Promise.all(
      activeBookings.map(async (booking) => {
        const latestLocation = await GPSLocation.findOne({ booking: booking._id })
          .sort({ timestamp: -1 });

        return {
          booking: {
            id: booking._id,
            trackingCode: booking.trackingCode,
            status: booking.status,
            origin: booking.origin,
            destination: booking.destination
          },
          vehicle: booking.assignedVehicle,
          driver: booking.assignedDriver,
          location: latestLocation
        };
      })
    );

    res.status(200).json({
      success: true,
      count: fleetLocations.length,
      data: fleetLocations.filter(item => item.location) // Only include vehicles with GPS data
    });

  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Start GPS simulation for a booking
 * @route   POST /api/gps/simulate/:bookingId/start
 * @access  Private (Admin only)
 */
exports.startGPSSimulation = async (req, res, next) => {
  try {
    const { bookingId } = req.params;
    const { updateInterval, speedKmH, steps } = req.body;

    const result = await gpsSimulator.startSimulation(bookingId, {
      updateInterval,
      speedKmH,
      steps
    });

    res.status(200).json({
      success: true,
      message: 'GPS simulation started successfully',
      data: result
    });

  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Stop GPS simulation for a booking
 * @route   POST /api/gps/simulate/:bookingId/stop
 * @access  Private (Admin only)
 */
exports.stopGPSSimulation = async (req, res, next) => {
  try {
    const { bookingId } = req.params;
    
    const stopped = await gpsSimulator.stopSimulation(bookingId);

    if (stopped) {
      res.status(200).json({
        success: true,
        message: 'GPS simulation stopped successfully'
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'No active simulation found for this booking'
      });
    }

  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get active simulations
 * @route   GET /api/gps/simulate/active
 * @access  Private (Admin only)
 */
exports.getActiveSimulations = async (req, res, next) => {
  try {
    const activeSimulations = gpsSimulator.getActiveSimulations();

    res.status(200).json({
      success: true,
      count: activeSimulations.length,
      data: activeSimulations
    });

  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Record GPS location (for real devices)
 * @route   POST /api/gps/location
 * @access  Private (Driver only)
 */
exports.recordGPSLocation = async (req, res, next) => {
  try {
    const {
      bookingId,
      vehicleId,
      coordinates,
      speed,
      heading,
      altitude,
      accuracy,
      address
    } = req.body;

    const location = await GPSLocation.create({
      booking: bookingId,
      vehicle: vehicleId,
      coordinates,
      speed,
      heading,
      altitude,
      accuracy,
      address,
      isSimulated: false
    });

    // Update booking current location
    await Booking.findByIdAndUpdate(bookingId, {
      currentLocation: coordinates
    });

    res.status(201).json({
      success: true,
      data: location
    });

  } catch (error) {
    next(error);
  }
};
