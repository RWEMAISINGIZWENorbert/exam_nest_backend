import { GoogleGenerativeAI } from '@google/generative-ai';
import File from '../models/File.js';
import answerFileModel from '../models/answerFile.js';
import fs from 'fs';
import PDFDocument from 'pdfkit';
import https from 'https';

// Initialize Google AI with explicit configuration
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY, {
    apiVersion: 'v1'
});

// Function to extract questions from content
function extractQuestions(content) {
    const lines = content.split('\n');
    return lines.filter(line => 
        line.trim().endsWith('?') || 
        /^\d+[\.\)]\s/.test(line.trim()) || 
        /^[A-Z][a-z]+\s+\d+[\.\)]\s/.test(line.trim())
    );
}

// Function to generate answers using Gemini
async function generateAnswers(questions) {
    const answers = [];
    const model = genAI.getGenerativeModel({ 
        model: "gemini-2.5-flash-preview-05-20",
        generationConfig: {
            temperature: 0.3,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
        }
    });
    
    // Process questions in batches of 5 to avoid rate limiting
    const batchSize = 5;
    for (let i = 0; i < questions.length; i += batchSize) {
        const batch = questions.slice(i, i + batchSize);
        
        // Process each question in the batch
        for (const question of batch) {
            try {
                const result = await model.generateContent({
                    contents: [{
                        parts: [{
                            text: `You are a technical expert. Please provide a concise answer to this question with a maximum of 3 key points. Keep it brief but accurate:

${question}

Format your answer as:
1. Main point
2. Supporting point (if relevant)
3. Example or application (if relevant)

If the question is incomplete, note that and provide a brief general explanation.`
                        }]
                    }]
                });
                
                const response = await result.response;
                const answer = response.text();
                
                if (!answer || answer.trim() === '') {
                    answers.push({
                        question,
                        answer: "No answer generated. Please try again."
                    });
                } else {
                    answers.push({
                        question,
                        answer: answer
                    });
                }
                
            } catch (error) {
                console.error(`Error generating answer for question: ${question}`, error);
                if (error.status === 429) {
                    // If we hit rate limit, wait for the suggested retry delay
                    const retryDelay = error.errorDetails?.find(detail => detail['@type'] === 'type.googleapis.com/google.rpc.RetryInfo')?.retryDelay || '60s';
                    const delayMs = parseInt(retryDelay) * 1000;
                    console.log(`Rate limit hit. Waiting for ${retryDelay} before retrying...`);
                    await new Promise(resolve => setTimeout(resolve, delayMs));
                    // Retry the current question
                    i--;
                    continue;
                }
                if (error.message.includes('API key')) {
                    throw new Error('Invalid or missing Google AI API key. Please check your .env file.');
                }
                answers.push({
                    question,
                    answer: `Error: ${error.message}`
                });
            }
            
            // Add a delay between requests within the batch
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
        
        // Add a longer delay between batches
        if (i + batchSize < questions.length) {
            await new Promise(resolve => setTimeout(resolve, 60000)); // Wait 1 minute between batches
        }
    }
    
    return answers;
}

// Function to create PDF with questions and answers
function createAnswerPDF(questionsAndAnswers, outputPath) {
    const doc = new PDFDocument();
    const stream = fs.createWriteStream(outputPath);
    
    doc.pipe(stream);
    
    questionsAndAnswers.forEach((item, index) => {
        doc.fontSize(14).text(`Question ${index + 1}:`, { underline: true });
        doc.fontSize(12).text(item.question);
        doc.moveDown();
        
        doc.fontSize(14).text('Answer:', { underline: true });
        doc.fontSize(12).text(item.answer);
        doc.moveDown(2);
    });
    
    doc.end();
    
    return new Promise((resolve, reject) => {
        stream.on('finish', resolve);
        stream.on('error', reject);
    });
}

// Controller function to process file and generate answers
export const processFileAndGenerateAnswers = async (req, res) => {
    try {
        const fileId = req.params.fileId;
        const file = await File.findById(fileId);
        
        if (!file) {
            return res.status(404).json({ error: 'File not found' });
        }
        
        // Extract questions from file content
        const questions = extractQuestions(file.content);
        
        if (questions.length === 0) {
            return res.status(400).json({ error: 'No questions found in the file' });
        }
        
        // Generate answers using Gemini
        const questionsAndAnswers = await generateAnswers(questions);
        
        // Create PDF with questions and answers
        const outputPath = `uploads/answers_${fileId}.pdf`;
        await createAnswerPDF(questionsAndAnswers, outputPath);
        
        // Create new file document for answers
        const answerFile = new answerFileModel({
            filename: `answers_${fileId}.pdf`,
            originalName: `answers_${file.originalName}`,
            mimeType: 'application/pdf',
            size: fs.statSync(outputPath).size,
            content: questionsAndAnswers.map(qa => 
                `Q: ${qa.question}\nA: ${qa.answer}`
            ).join('\n\n'),
            fileQuestionId: fileId // <-- Reference to the question file
        });
        
        await answerFile.save();
        
        // Clean up temporary file
        fs.unlinkSync(outputPath);
        
        res.status(200).json({
            message: 'Answers generated successfully',
            file: answerFile
        });
        
    } catch (error) {
        console.error('Error processing file:', error);
        res.status(500).json({ error: error.message });
    }
}; 