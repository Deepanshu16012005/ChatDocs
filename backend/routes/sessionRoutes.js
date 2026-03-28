const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const { createSession, getSessions, updateSessionTitle } = require('../controllers/sessionController');

router.post('/', protect, createSession);
router.get('/', protect, getSessions);
router.patch('/:sessionId', protect, updateSessionTitle)
module.exports = router;