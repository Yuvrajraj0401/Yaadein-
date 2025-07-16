const express = require('express');
const router = express.Router();
const cloudinary = require('../Config/Cloudinary.config');
const authmiddleware = require('../middlewares/auth');
const { upload, uploadToCloudinary } = require('../Config/multer.config');
const fileModel = require('../models/files.models');

// ✅ Show Home Page with Uploaded Files
router.get('/home', authmiddleware, async (req, res) => {
  const userFiles = await fileModel.find({ user: req.user.userId });
  res.render('home', { files: userFiles });
});

// ✅ Upload File Route
router.post('/upload', authmiddleware, upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).send('No file uploaded');

  try {
    const result = await uploadToCloudinary(req.file, 'drive-222ea');

    await fileModel.create({
      path: result.secure_url,
      public_id: result.public_id,
      originalname: req.file.originalname,
      user: req.user.userId
    });

    res.redirect('/home');
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    res.status(500).send('Upload failed');
  }
});

// ✅ Download File
router.get('/download/:publicId', authmiddleware, async (req, res) => {
  const publicId = req.params.publicId;

  const file = await fileModel.findOne({
    user: req.user.userId,
    public_id: publicId
  });

  if (!file) return res.status(404).json({ message: 'File not found' });

  res.redirect(file.path);
});

// ✅ Delete File
router.post('/delete/:publicId', authmiddleware, async (req, res) => {
  const publicId = req.params.publicId;

  try {
    const file = await fileModel.findOne({
      user: req.user.userId,
      public_id: publicId
    });

    if (!file) return res.status(404).json({ message: 'File not found or unauthorized' });

    await cloudinary.uploader.destroy(publicId);
    await fileModel.deleteOne({ public_id: publicId });

    res.redirect('/home');
  } catch (err) {
    console.error('Delete error:', err);
    res.status(500).json({ message: 'Failed to delete file' });
  }
});

module.exports = router;
