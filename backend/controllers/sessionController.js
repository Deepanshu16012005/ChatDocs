const Session = require('../models/Session');
const Chat = require('../models/Chat');

// @route   POST /api/sessions
// @desc    Create a new chat session
exports.createSession = async (req, res) => {
    try {
        const userId = req.user.userId;

        const newSession = new Session({
            user_id: userId,
            title: 'New Chat'
        });
        await newSession.save();

        res.status(201).json({
            message: 'Session created successfully',
            session: {
                id: newSession._id,
                title: newSession.title,
                createdAt: newSession.createdAt
            }
        });

    } catch (error) {
        console.error('Create Session Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// @route   GET /api/sessions
// @desc    Get all sessions for logged in user
exports.getSessions = async (req, res) => {
    try {
        const userId = req.user.userId;

        const sessions = await Session.find({ user_id: userId })
            .sort({ createdAt: -1 }); // newest first

        res.status(200).json({ sessions });

    } catch (error) {
        console.error('Get Sessions Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// @route   PATCH /api/sessions/:sessionId
// @desc    Update session title
exports.updateSessionTitle = async (req, res) => {
    try {
        const { sessionId } = req.params;
        const { title } = req.body;
        const userId = req.user.userId;

        if (!title || title.trim() === '') {
            return res.status(400).json({ error: 'Title cannot be empty' });
        }

        // Find session and verify it belongs to this user
        const session = await Session.findOneAndUpdate(
            { _id: sessionId, user_id: userId },
            { title: title.trim() },
            { new: true }  // return updated document
        );

        if (!session) {
            return res.status(403).json({ error: 'Session not found or access denied' });
        }

        res.status(200).json({
            message: 'Session title updated successfully',
            session: {
                id: session._id,
                title: session.title,
                createdAt: session.createdAt
            }
        });

    } catch (error) {
        console.error('Update Session Title Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};