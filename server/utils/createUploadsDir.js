const fs = require('fs');
const path = require('path');

const uploadsDir = path.join(__dirname, '..', 'uploads');

// Check if uploads directory exists, if not create it
if (!fs.existsSync(uploadsDir)) {
  console.log('Creating uploads directory...');
  fs.mkdirSync(uploadsDir);
  console.log('Uploads directory created successfully!');
} else {
  console.log('Uploads directory already exists.');
} 