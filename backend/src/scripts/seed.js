require('dotenv').config();
const connectDB = require('../config/database');
const User = require('../models/User');
const Vehicle = require('../models/Vehicle');

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany();
    await Vehicle.deleteMany();

    console.log('🗑️  Cleared existing data');

    // Create admin user
    const admin = await User.create({
      name: 'Sghaier Bacem',
      email: process.env.ADMIN_EMAIL || 'service.sgh.trasporti@hotmail.com',
      password: process.env.ADMIN_PASSWORD || 'Admin@123456',
      phone: '+39 345 054 4226',
      role: 'admin',
      emailVerified: true,
    });

    console.log('✅ Admin user created');

    // Create sample vehicles
    const vehicles = await Vehicle.insertMany([
      {
        name: 'Van 01',
        type: 'van',
        licensePlate: 'AB123CD',
        brand: 'Mercedes',
        model: 'Sprinter',
        year: 2022,
        capacity: {
          weight: 1500,
          volume: 12,
        },
        specifications: {
          length: 5.9,
          width: 2.0,
          height: 2.4,
          hasLiftGate: true,
          hasRefrigeration: false,
          hasGPS: true,
        },
        status: 'available',
        images: [],
      },
      {
        name: 'Refrigerated Truck 01',
        type: 'refrigerated',
        licensePlate: 'EF456GH',
        brand: 'Iveco',
        model: 'Eurocargo',
        year: 2021,
        capacity: {
          weight: 3500,
          volume: 25,
        },
        specifications: {
          length: 7.2,
          width: 2.5,
          height: 2.8,
          hasLiftGate: true,
          hasRefrigeration: true,
          hasGPS: true,
        },
        status: 'available',
        images: [],
      },
      {
        name: 'Semi Truck 01',
        type: 'semi_truck',
        licensePlate: 'IJ789KL',
        brand: 'Volvo',
        model: 'FH16',
        year: 2023,
        capacity: {
          weight: 12000,
          volume: 90,
        },
        specifications: {
          length: 13.6,
          width: 2.6,
          height: 4.0,
          hasLiftGate: false,
          hasRefrigeration: false,
          hasGPS: true,
        },
        status: 'available',
        images: [],
      },
    ]);

    console.log(`✅ ${vehicles.length} vehicles created`);

    console.log('\n✅ Database seeded successfully!');
    console.log('\n📝 Admin credentials:');
    console.log(`Email: ${admin.email}`);
    console.log(`Password: ${process.env.ADMIN_PASSWORD || 'Admin@123456'}`);
    console.log('\n⚠️  Please change the admin password after first login!\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedData();
