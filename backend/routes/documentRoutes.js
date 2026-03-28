const express = require('express');
const router = express.Router();
const multer = require('multer');
const protect = require('../middleware/authMiddleware');
const { uploadDocument, getDocuments } = require('../controllers/documentController');

// Multer configuration - store file in memory
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Routes
router.post('/upload', protect, upload.single('file'), uploadDocument);
router.get('/', protect, getDocuments);

module.exports = router;