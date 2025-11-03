require('dotenv').config();
const mongoose = require('mongoose');
const Booking = require('../models/Booking');
const Quote = require('../models/Quote');
const User = require('../models/User');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB Connected:', mongoose.connection.host);
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    await connectDB();

    // Find admin user
    const admin = await User.findOne({ role: 'admin' });
    if (!admin) {
      console.error('❌ No admin user found. Please run npm run seed first.');
      process.exit(1);
    }

    // Create sample bookings
    const bookings = [
      {
        user: admin._id,
        trackingCode: 'TRK' + Date.now() + '001',
        serviceType: 'express',
        origin: {
          address: 'Via Roma 10',
          city: 'Milano',
          postalCode: '20121',
          country: 'Italy',
        },
        destination: {
          address: 'Via Torino 20',
          city: 'Roma',
          postalCode: '00184',
          country: 'Italy',
        },
        customerInfo: {
          name: 'Mario Rossi',
          email: 'mario.rossi@example.com',
          phone: '+39 123 456 7890',
          company: 'Rossi Logistics',
        },
        packageDetails: {
          type: 'fragile',
          weight: 500,
          dimensions: { length: 120, width: 80, height: 100 },
          description: 'Electronics equipment',
          quantity: 5,
        },
        pickupDate: new Date(),
        deliveryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
        status: 'pending',
        estimatedPrice: 450,
        notes: 'Handle with care - fragile items',
      },
      {
        user: admin._id,
        trackingCode: 'TRK' + Date.now() + '002',
        serviceType: 'standard',
        origin: {
          address: 'Via Napoli 15',
          city: 'Napoli',
          postalCode: '80100',
          country: 'Italy',
        },
        destination: {
          address: 'Via Firenze 30',
          city: 'Firenze',
          postalCode: '50122',
          country: 'Italy',
        },
        customerInfo: {
          name: 'Giulia Bianchi',
          email: 'giulia.bianchi@example.com',
          phone: '+39 098 765 4321',
          company: 'Bianchi Trading',
        },
        packageDetails: {
          type: 'oversized',
          weight: 1200,
          dimensions: { length: 150, width: 120, height: 150 },
          description: 'Furniture and home appliances',
          quantity: 10,
        },
        pickupDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // Tomorrow
        deliveryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
        status: 'confirmed',
        estimatedPrice: 850,
        notes: 'Requires truck with lift gate',
      },
      {
        user: admin._id,
        trackingCode: 'TRK' + Date.now() + '003',
        serviceType: 'express',
        origin: {
          address: 'Via Bologna 25',
          city: 'Bologna',
          postalCode: '40121',
          country: 'Italy',
        },
        destination: {
          address: 'Via Verona 40',
          city: 'Verona',
          postalCode: '37121',
          country: 'Italy',
        },
        customerInfo: {
          name: 'Luca Ferrari',
          email: 'luca.ferrari@example.com',
          phone: '+39 345 678 9012',
          company: 'Ferrari Express',
        },
        packageDetails: {
          type: 'standard',
          weight: 250,
          dimensions: { length: 100, width: 60, height: 80 },
          description: 'Documents and small packages',
          quantity: 3,
        },
        pickupDate: new Date(),
        deliveryDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // Tomorrow
        status: 'in_transit',
        estimatedPrice: 280,
        notes: 'Urgent delivery required',
      },
    ];

    await Booking.insertMany(bookings);
    console.log('✅ Sample bookings created:', bookings.length);

    // Create sample quotes
    const quotes = [
      {
        customerInfo: {
          name: 'Alessandro Conti',
          email: 'alessandro.conti@example.com',
          phone: '+39 333 111 2222',
          company: 'Conti Imports',
        },
        origin: {
          address: 'Via Porto 50',
          city: 'Genova',
          country: 'Italy',
        },
        destination: {
          address: 'Via Mare 100',
          city: 'Palermo',
          country: 'Italy',
        },
        serviceType: 'standard',
        packageDetails: {
          type: 'oversized',
          weight: 800,
          dimensions: { length: 200, width: 150, height: 150 },
          quantity: 5,
          description: 'Industrial machinery parts',
        },
        status: 'pending',
        notes: 'Need temperature controlled transport',
      },
      {
        customerInfo: {
          name: 'Francesca Marino',
          email: 'francesca.marino@example.com',
          phone: '+39 320 555 6666',
          company: 'Marino Exports',
        },
        origin: {
          address: 'Via Moda 25',
          city: 'Torino',
          country: 'Italy',
        },
        destination: {
          address: 'Via Porto 80',
          city: 'Bari',
          country: 'Italy',
        },
        serviceType: 'express',
        packageDetails: {
          type: 'fragile',
          weight: 400,
          dimensions: { length: 120, width: 80, height: 60 },
          quantity: 10,
          description: 'Fashion items and textiles',
        },
        status: 'pending',
        notes: 'Urgent delivery required for fashion show',
      },
      {
        customerInfo: {
          name: 'Roberto Greco',
          email: 'roberto.greco@example.com',
          phone: '+39 347 888 9999',
          company: 'Greco Logistics',
        },
        origin: {
          address: 'Via Laguna 15',
          city: 'Venezia',
          country: 'Italy',
        },
        destination: {
          address: 'Via Etna 200',
          city: 'Catania',
          country: 'Italy',
        },
        serviceType: 'standard',
        packageDetails: {
          type: 'refrigerated',
          weight: 2000,
          dimensions: { length: 300, width: 200, height: 200 },
          quantity: 20,
          description: 'Food products - temperature controlled',
        },
        status: 'reviewed',
        notes: 'Requires refrigerated truck',
        estimatedPrice: {
          amount: 1500,
          currency: 'EUR',
        },
      },
    ];

    await Quote.insertMany(quotes);
    console.log('✅ Sample quotes created:', quotes.length);

    console.log('\n✅ Database seeded with bookings and quotes successfully!');
    console.log('\n📊 Summary:');
    console.log('   - Bookings:', bookings.length);
    console.log('   - Quotes:', quotes.length);
    console.log('\n🔗 Access admin panel at: http://localhost:3000/en/admin/dashboard');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
