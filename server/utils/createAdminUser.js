const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');

// Load environment variables
dotenv.config();

// Connect to database
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const createAdmin = async () => {
  try {
    const adminData = {
      name: 'Admin User',
      email: 'admin@rewear.com',
      password: 'admin123',
      isAdmin: true
    };

    // Check if admin already exists
    const adminExists = await User.findOne({ email: adminData.email });

    if (adminExists) {
      console.log('Admin user already exists');
      process.exit(0);
    }

    // Create admin user
    const admin = await User.create(adminData);

    console.log(`Admin user created: ${admin.email}`);
    process.exit(0);
  } catch (error) {
    console.error(`Error creating admin user: ${error.message}`);
    process.exit(1);
  }
};

createAdmin(); 