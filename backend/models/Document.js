const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    filename: { type: String, required: true },
    filesize: { type: Number, required: true },
    filetype: { type: String, required: true }, // e.g., "PDF"
    uploadedAt: { type: Date, default: Date.now },
    processingStatus: { type: String, default: 'pending' } // pending, processing, completed, failed
});

module.exports = mongoose.model('Document', documentSchema);