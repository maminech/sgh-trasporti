const GPSLocation = require('../models/GPSLocation');
const Booking = require('../models/Booking');

/**
 * GPS Tracking Simulator Service
 * Simulates vehicle movement along a route for testing purposes
 */

class GPSSimulator {
  constructor() {
    this.activeSimulations = new Map(); // bookingId -> intervalId
  }

  /**
   * Calculate intermediate points along a route
   */
  interpolateRoute(start, end, steps = 20) {
    const points = [];
    for (let i = 0; i <= steps; i++) {
      const ratio = i / steps;
      points.push({
        latitude: start.latitude + (end.latitude - start.latitude) * ratio,
        longitude: start.longitude + (end.longitude - start.longitude) * ratio
      });
    }
    return points;
  }

  /**
   * Calculate distance between two coordinates (Haversine formula)
   */
  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth radius in km
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  toRad(degrees) {
    return degrees * (Math.PI / 180);
  }

  /**
   * Calculate bearing between two points
   */
  calculateBearing(lat1, lon1, lat2, lon2) {
    const dLon = this.toRad(lon2 - lon1);
    const y = Math.sin(dLon) * Math.cos(this.toRad(lat2));
    const x = Math.cos(this.toRad(lat1)) * Math.sin(this.toRad(lat2)) -
              Math.sin(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) * Math.cos(dLon);
    const bearing = Math.atan2(y, x);
    return (this.toDeg(bearing) + 360) % 360;
  }

  toDeg(radians) {
    return radians * (180 / Math.PI);
  }

  /**
   * Start GPS tracking simulation for a booking
   */
  async startSimulation(bookingId, options = {}) {
    try {
      const booking = await Booking.findById(bookingId).populate('assignedVehicle');
      
      if (!booking) {
        throw new Error('Booking not found');
      }

      if (!booking.origin?.coordinates || !booking.destination?.coordinates) {
        throw new Error('Booking must have origin and destination coordinates');
      }

      if (!booking.assignedVehicle) {
        throw new Error('No vehicle assigned to booking');
      }

      // Stop existing simulation if any
      this.stopSimulation(bookingId);

      const {
        updateInterval = 5000, // Update every 5 seconds
        speedKmH = 60, // Average speed 60 km/h
        steps = 50 // Number of route points
      } = options;

      const route = this.interpolateRoute(
        booking.origin.coordinates,
        booking.destination.coordinates,
        steps
      );

      let currentStep = 0;

      // Create initial GPS location
      await GPSLocation.create({
        booking: bookingId,
        vehicle: booking.assignedVehicle._id,
        coordinates: route[0],
        speed: 0,
        heading: this.calculateBearing(
          route[0].latitude,
          route[0].longitude,
          route[1].latitude,
          route[1].longitude
        ),
        status: 'stopped',
        isSimulated: true
      });

      // Update booking status
      booking.status = 'in_transit';
      await booking.save();

      // Start simulation interval
      const intervalId = setInterval(async () => {
        currentStep++;

        if (currentStep >= route.length) {
          // Simulation complete
          await this.stopSimulation(bookingId);
          
          // Update booking status
          booking.status = 'delivered';
          booking.actualDeliveryDate = new Date();
          await booking.save();

          console.log(`Simulation completed for booking ${bookingId}`);
          return;
        }

        const currentPoint = route[currentStep];
        const previousPoint = route[currentStep - 1];
        const nextPoint = route[currentStep + 1] || currentPoint;

        // Calculate speed with some randomness
        const baseSpeed = speedKmH + (Math.random() - 0.5) * 20;
        const speed = Math.max(0, Math.min(120, baseSpeed));

        // Determine status based on speed
        let status = 'moving';
        if (speed < 5) status = 'stopped';
        else if (speed < 20) status = 'idle';

        // Create GPS location record
        await GPSLocation.create({
          booking: bookingId,
          vehicle: booking.assignedVehicle._id,
          coordinates: currentPoint,
          speed: Math.round(speed),
          heading: Math.round(this.calculateBearing(
            currentPoint.latitude,
            currentPoint.longitude,
            nextPoint.latitude,
            nextPoint.longitude
          )),
          accuracy: 5 + Math.random() * 15,
          status,
          isSimulated: true
        });

        // Update booking current location
        booking.currentLocation = currentPoint;
        await booking.save();

        console.log(`Simulation update: booking ${bookingId}, step ${currentStep}/${route.length}`);
      }, updateInterval);

      this.activeSimulations.set(bookingId.toString(), intervalId);

      return {
        success: true,
        message: 'GPS simulation started',
        bookingId,
        totalSteps: route.length,
        estimatedDuration: (route.length * updateInterval) / 1000 / 60 // minutes
      };

    } catch (error) {
      console.error('GPS Simulation error:', error);
      throw error;
    }
  }

  /**
   * Stop GPS tracking simulation
   */
  async stopSimulation(bookingId) {
    const intervalId = this.activeSimulations.get(bookingId.toString());
    
    if (intervalId) {
      clearInterval(intervalId);
      this.activeSimulations.delete(bookingId.toString());
      console.log(`Simulation stopped for booking ${bookingId}`);
      return true;
    }
    
    return false;
  }

  /**
   * Get active simulations
   */
  getActiveSimulations() {
    return Array.from(this.activeSimulations.keys());
  }

  /**
   * Stop all simulations
   */
  stopAllSimulations() {
    this.activeSimulations.forEach((intervalId) => {
      clearInterval(intervalId);
    });
    this.activeSimulations.clear();
    console.log('All simulations stopped');
  }
}

// Singleton instance
module.exports = new GPSSimulator();
