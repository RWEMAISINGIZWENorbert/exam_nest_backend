import mongoose from 'mongoose';

const fileSchema = new mongoose.Schema({
    filename: {
        type: String,
        required: true
    },
    originalName: {
        type: String,
        required: true
    },
    mimeType: {
        type: String,
        required: true
    },
    size: {
        type: Number,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    uploadDate: {
        type: Date,
        default: Date.now
    },
    schoolId: {
       type: mongoose.Schema.Types.ObjectId,
       required: true,
       ref: 'school'
    }  
}, {
     timestamps: true
});

const questionsPaperFileModel = mongoose.model('File', fileSchema); 
export default questionsPaperFileModel;