const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { protect, admin } = require('../middleware/auth');
const fs = require('fs').promises;
const path = require('path');

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../uploads');
fs.mkdir(uploadsDir, { recursive: true }).catch(console.error);

// @route   POST /api/upload/single
// @desc    Upload single image
// @access  Private/Admin
router.post('/single', protect, admin, upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const fileUrl = `/uploads/${req.file.filename}`;
    
    res.json({
      success: true,
      url: fileUrl,
      filename: req.file.filename
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Upload failed' });
  }
});

// @route   POST /api/upload/multiple
// @desc    Upload multiple images
// @access  Private/Admin
router.post('/multiple', protect, admin, upload.array('images', 10), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    const urls = req.files.map(file => `/uploads/${file.filename}`);
    
    res.json({
      success: true,
      urls,
      count: req.files.length
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Upload failed' });
  }
});

// @route   DELETE /api/upload/:filename
// @desc    Delete uploaded file
// @access  Private/Admin
router.delete('/:filename', protect, admin, async (req, res) => {
  try {
    const filePath = path.join(uploadsDir, req.params.filename);
    await fs.unlink(filePath);
    
    res.json({
      success: true,
      message: 'File deleted'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Delete failed' });
  }
});

module.exports = router;
