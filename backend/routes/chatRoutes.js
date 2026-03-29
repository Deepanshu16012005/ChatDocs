const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const protect = require('../middleware/authMiddleware');
const { sendMessage, getChatHistory } = require('../controllers/chatController');

// Rate limiter: 20 requests per 15 minutes per user
const chatLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes in milliseconds
    max: 20,                   // max 20 requests per window
    keyGenerator: (req) => req.user.userId, // limit per user not per IP
    handler: (req, res) => {
        res.status(429).json({
            error: 'Too many requests. Please wait 15 minutes before sending more messages.'
        });
    }
});

router.post('/', protect, chatLimiter, sendMessage);
router.get('/:sessionId', protect, getChatHistory);

module.exports = router;