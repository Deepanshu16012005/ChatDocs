const Chat = require('../models/Chat');
const Session = require('../models/Session');
const axios = require('axios');

// @route   POST /api/chat
// @desc    Send a message and get AI response
exports.sendMessage = async (req, res) => {
    try {
        const { message, session_id } = req.body;
        const userId = req.user.userId;

        if (!message || !session_id) {
            return res.status(400).json({ error: 'Missing message or session_id' });
        }

        const session = await Session.findOne({
            _id: session_id,
            user_id: userId
        });
        if (!session) {
            return res.status(403).json({ error: 'Session not found or access denied' });
        }

        const userMessage = new Chat({
            session_id,
            user_id: userId,
            role: 'user',
            content: message,
            sources: []
        });
        await userMessage.save();

        // Get last 2 turns of chat history for RAG microservice
        const chatHistory = await Chat.find({ session_id })
            .sort({ timestamp: -1 })
            .limit(4)  
            .sort({ timestamp: 1 }); // re-sort ascending for correct order

        // Python RAG microservice
        const ragResponse = await axios.post(
            `${process.env.RAG_MICROSERVICE_URL}/query`,
            {
                query: message,
                user_id: userId,
                chat_history: chatHistory.map(msg => ({
                    role: msg.role,
                    content: msg.content
                }))
            },
            {
                headers: { 'Content-Type': 'application/json', 
                    'x-internal-key': process.env.INTERNAL_AUTH_KEY
                }
            }
        );

        // AI response to MongoDB
        const aiMessage = new Chat({
            session_id,
            user_id: userId,
            role: 'assistant',
            content: ragResponse.data.answer,
            sources: ragResponse.data.sources || []
        });
        await aiMessage.save();

        // Step 7: Return response to React
        res.status(200).json({
            response: ragResponse.data.answer,
            sources: ragResponse.data.sources || [],
            session_id
        });

    } catch (error) {
        console.error('Chat Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// @route   GET /api/chat/:sessionId
// @desc    Get chat history for a session
exports.getChatHistory = async (req, res) => {
    try {
        const { sessionId } = req.params;
        const userId = req.user.userId;

        // Verify session belongs to this user
        const session = await Session.findOne({
            _id: sessionId,
            user_id: userId
        });
        if (!session) {
            return res.status(403).json({ error: 'Session not found or access denied' });
        }

        // Get all messages for this session
        const messages = await Chat.find({ session_id: sessionId })
            .sort({ timestamp: 1 }); // oldest first

        res.status(200).json({
            session_id: sessionId,
            messages
        });

    } catch (error) {
        console.error('Get Chat History Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};