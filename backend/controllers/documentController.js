const Document = require('../models/Document');
const FormData = require('form-data');
const axios = require('axios');

// @route   POST /api/documents/upload
// @desc    Upload a document and send to RAG microservice
exports.uploadDocument = async (req, res) => {
    let newDocument= null;
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const allowedTypes = ['application/pdf'];
        if (!allowedTypes.includes(req.file.mimetype)) {
            return res.status(400).json({ error: 'Only PDF files are supported' });
        }

        const maxSize = 10 * 1024 * 1024;
        if (req.file.size > maxSize) {
            return res.status(400).json({ error: 'File size exceeds 10MB limit' });
        }

        //Save document metadata to MongoDB
        newDocument = new Document({
            user_id: req.user.userId,
            filename: req.file.originalname,
            filesize: req.file.size,
            filetype: 'PDF',
            processingStatus: 'processing'
        });
        await newDocument.save();

        //Forward file to Python RAG microservice
        const formData = new FormData();
        formData.append('document_id', newDocument._id.toString());
        formData.append('user_id', req.user.userId);
        formData.append('filename', req.file.originalname);
        formData.append('filetype', 'PDF');
        formData.append('file_content', req.file.buffer, {
            filename: req.file.originalname,
            contentType: req.file.mimetype
        });

        const ragResponse = await axios.post(
            `${process.env.RAG_MICROSERVICE_URL}/process`,
            formData,
            { 
                headers: {
                    ...formData.getHeaders(),
                    'x-internal-key': process.env.INTERNAL_AUTH_KEY 
                },
                timeout:100000
            }
        );

        newDocument.processingStatus = 'completed';
        await newDocument.save();

        res.status(201).json({
            message: 'Document uploaded and processed successfully',
            document: {
                id: newDocument._id,
                filename: newDocument.filename,
                filesize: newDocument.filesize,
                filetype: newDocument.filetype,
                uploadedAt: newDocument.uploadedAt,
                processingStatus: newDocument.processingStatus
            },
            chunks_processed: ragResponse.data.chunks_processed
        });

    } catch (error) {
        console.error('Document Upload Error:', error);

        // If RAG microservice fails update status to failed
        if (newDocument && newDocument._id) {
            await Document.findByIdAndDelete({ _id: newDocument._id });
            console.log('Cleaned up failed document entry from MongoDB');
    }
        res.status(500).json(
            {
                error: 'Document processing failed' 
            }
        );
    }
};

// @route   GET /api/documents
// @desc    Get all documents for logged in user
exports.getDocuments = async (req, res) => {
    try {
        const documents = await Document.find({ user_id: req.user.userId })
            .sort(
                { 
                    uploadedAt: -1 
                }
            ); 

        res.status(200).json({ documents });

    } catch (error) {
        console.error('Get Documents Error:', error);
        res.status(500).json({
            error: 'Internal server error' 
        });
    }
};