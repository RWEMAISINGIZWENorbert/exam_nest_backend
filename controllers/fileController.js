import multer from 'multer';
import path from 'path';
import fs from 'fs';
import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';
import File from '../models/File.js';
import answerFileModel from '../models/answerFile.js';

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

export const upload = multer({ storage: storage });

// Upload and process file (single file upload)
export  const uploadFile = async (req, res) => {
    try {
        // Multer middleware will be applied in the route, so req.file is available here
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
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all files
export const getAllFiles = async (req, res) => {
    try {
         const schoolId = req.schoolId;
        const files = await File.find({ schoolId });
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

// Upload questions (and optional answers) file (multiple file upload)
export const uploadQuestionsAndAnswers = async (req, res) => {
    // Multer middleware will be applied in the route, so req.files is available here
    console.log('req.body:', req.body);
    console.log('req.files:', req.files);

    const hasAnswers = req.body && req.body.hasAnswers === 'true';

    if (!req.files || !req.files['questions'] || req.files['questions'].length === 0) {
        return res.status(400).json({ error: 'Questions file is required' });
    }
    // Process questions file
    const questionsFile = req.files['questions'][0];
    let questionsContent = '';
    if (questionsFile.mimetype === 'application/pdf') {
        const dataBuffer = fs.readFileSync(questionsFile.path);
        const pdfData = await pdfParse(dataBuffer);
        questionsContent = pdfData.text;
    } else if (questionsFile.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        const result = await mammoth.extractRawText({ path: questionsFile.path });
        questionsContent = result.value;
    }
    const fileDoc = new File({
        filename: questionsFile.filename,
        originalName: questionsFile.originalname,
        mimeType: questionsFile.mimetype,
        size: questionsFile.size,
        content: questionsContent
    });
    await fileDoc.save();

    let answerFileDoc = null;
    if (hasAnswers) {
         console.log('----------has Answers', hasAnswers);
        if (!req.files || !req.files['answers'] || req.files['answers'].length === 0) {
            return res.status(400).json({ error: 'Answers file is required if hasAnswers is true' });
        }
        const answersFile = req.files['answers'][0];
        let answersContent = '';
        if (answersFile.mimetype === 'application/pdf') {
            const dataBuffer = fs.readFileSync(answersFile.path);
            const pdfData = await pdfParse(dataBuffer);
            answersContent = pdfData.text;
        } else if (answersFile.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
            const result = await mammoth.extractRawText({ path: answersFile.path });
            answersContent = result.value;
        }
        answerFileDoc = new answerFileModel({
            filename: answersFile.filename,
            originalName: answersFile.originalname,
            mimeType: answersFile.mimetype,
            size: answersFile.size,
            content: answersContent,
            fileQuestionId: fileDoc._id
        });
        await answerFileDoc.save();
        console.log("--------Answer File doc",answerFileDoc);
    }

    res.status(200).json({
        message: 'Files uploaded successfully',
        questionFile: fileDoc,
        answerFile: answerFileDoc
    });
}; 