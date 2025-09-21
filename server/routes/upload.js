const express = require('express');
const path = require('path');
const upload = require('../utils/fileUpload');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Protect all routes
router.use(protect);

// @desc    Upload image
// @route   POST /api/upload
// @access  Private
router.post('/', (req, res) => {
  upload.single('image')(req, res, (err) => {
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ 
          success: false, 
          error: 'File size too large. Max size is 5MB.' 
        });
      }
      return res.status(400).json({ success: false, error: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, error: 'Please upload a file' });
    }

    res.status(200).json({
      success: true,
      data: {
        fileName: req.file.filename,
        filePath: `/uploads/${req.file.filename}`
      }
    });
  });
});

// @desc    Upload multiple images
// @route   POST /api/upload/multiple
// @access  Private
router.post('/multiple', (req, res) => {
  upload.array('images', 5)(req, res, (err) => {
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ 
          success: false, 
          error: 'File size too large. Max size is 5MB per file.' 
        });
      }
      return res.status(400).json({ success: false, error: err.message });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, error: 'Please upload at least one file' });
    }

    const fileData = req.files.map(file => ({
      fileName: file.filename,
      filePath: `/uploads/${file.filename}`
    }));

    res.status(200).json({
      success: true,
      count: fileData.length,
      data: fileData
    });
  });
});

module.exports = router; 