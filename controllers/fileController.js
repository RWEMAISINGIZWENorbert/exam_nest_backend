import multer from 'multer';
import path from 'path';
import fs from 'fs';
import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';
import File from '../models/File.js';

// Configure multer for file upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = 'uploads/';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        const filetypes = /pdf|docx/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);

        if (extname && mimetype) {
            return cb(null, true);
        } else {
            cb('Error: Only PDF and DOCX files are allowed!');
        }
    }
}).single('file');

// Upload and process file
export  const uploadFile = async (req, res) => {
    try {
        upload(req, res, async function (err) {
            if (err) {
                return res.status(400).json({ error: err });
            }

            if (!req.file) {
                return res.status(400).json({ error: 'No file uploaded' });
            }

            let content = '';
            const filePath = req.file.path;

            // Process file based on type
            if (req.file.mimetype === 'application/pdf') {
                const dataBuffer = fs.readFileSync(filePath);
                const pdfData = await pdfParse(dataBuffer);
                content = pdfData.text;
            } else if (req.file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
                const result = await mammoth.extractRawText({ path: filePath });
                content = result.value;
            }

            // Create new file document
            const file = new File({
                filename: req.file.filename,
                originalName: req.file.originalname,
                mimeType: req.file.mimetype,
                size: req.file.size,
                content: content
            });

            await file.save();

            // Clean up uploaded file
            // fs.unlinkSync(filePath);

            res.status(200).json({
                message: 'File uploaded and processed successfully',
                file: file
            });
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all files
export const getAllFiles = async (req, res) => {
    try {
        const files = await File.find();
        res.status(200).json(files);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get file by ID
export const getFileById = async (req, res) => {
    try {
        const file = await File.findById(req.params.id);
        if (!file) {
            return res.status(404).json({ error: 'File not found' });
        }
        res.status(200).json(file);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}; 